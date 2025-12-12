/**
 * Vyxo Codex 2.0 - Notification Service
 * Service centralisé pour gérer les notifications multi-canal
 * Canaux: In-App, Email, Web Push
 */

import { createClient } from '@supabase/supabase-js';

export type NotificationType =
  | 'streak_milestone'
  | 'streak_risk'
  | 'badge_awarded'
  | 'vyxo_flash_ready'
  | 'challenge_assigned'
  | 'duel_challenge'
  | 'validation_required'
  | 'incident_created';

export type NotificationChannel = 'in_app' | 'email' | 'push';

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  channels?: NotificationChannel[];
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  actionUrl?: string;
}

/**
 * Service principal de notifications
 */
export class NotificationService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  /**
   * Envoyer une notification sur tous les canaux configurés
   */
  async send(payload: NotificationPayload): Promise<void> {
    const channels = payload.channels || ['in_app'];
    const results: Record<string, boolean> = {};

    // Exécuter tous les canaux en parallèle
    const promises = channels.map(async (channel) => {
      try {
        switch (channel) {
          case 'in_app':
            await this.sendInApp(payload);
            results[channel] = true;
            break;
          case 'email':
            await this.sendEmail(payload);
            results[channel] = true;
            break;
          case 'push':
            await this.sendPush(payload);
            results[channel] = true;
            break;
        }
      } catch (error) {
        console.error(`❌ Notification ${channel} failed:`, error);
        results[channel] = false;
      }
    });

    await Promise.allSettled(promises);

    // Log le résultat
    const successful = Object.values(results).filter(Boolean).length;
    console.log(`📬 Notification sent: ${successful}/${channels.length} channels successful`);
  }

  /**
   * Notification In-App (stockée en base)
   */
  private async sendInApp(payload: NotificationPayload): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .insert({
        user_id: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        data: payload.data,
        priority: payload.priority || 'normal',
        action_url: payload.actionUrl,
        read: false,
        created_at: new Date().toISOString(),
      });

    if (error) {
      throw new Error(`In-app notification failed: ${error.message}`);
    }

    console.log(`📱 In-app notification created for user ${payload.userId}`);
  }

  /**
   * Notification Email via Resend
   */
  private async sendEmail(payload: NotificationPayload): Promise<void> {
    // Récupérer l'email de l'utilisateur
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', payload.userId)
      .single();

    if (!profile?.email) {
      console.warn(`⚠️ No email found for user ${payload.userId}`);
      return;
    }

    // Envoyer via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vyxo Codex <notifications@vyxo.app>',
        to: profile.email,
        subject: payload.title,
        html: this.generateEmailTemplate(payload, profile.full_name),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Email notification failed: ${error}`);
    }

    console.log(`📧 Email sent to ${profile.email}`);
  }

  /**
   * Notification Push (Web Push API)
   */
  private async sendPush(payload: NotificationPayload): Promise<void> {
    // Récupérer les subscriptions push de l'utilisateur
    const { data: subscriptions } = await this.supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', payload.userId)
      .eq('active', true);

    if (!subscriptions || subscriptions.length === 0) {
      console.warn(`⚠️ No push subscriptions for user ${payload.userId}`);
      return;
    }

    // Envoyer à toutes les subscriptions
    const pushPromises = subscriptions.map(async (subscription) => {
      try {
        await this.sendWebPush(subscription.endpoint, subscription.keys, {
          title: payload.title,
          body: payload.message,
          icon: '/icons/vyxo-logo-192.png',
          badge: '/icons/vyxo-badge-72.png',
          data: {
            url: payload.actionUrl || '/dashboard',
            ...payload.data,
          },
        });
      } catch (error) {
        console.error(`Push to ${subscription.endpoint} failed:`, error);
        // Désactiver subscription si erreur 410 (Gone)
        if (error instanceof Error && error.message.includes('410')) {
          await this.supabase
            .from('push_subscriptions')
            .update({ active: false })
            .eq('id', subscription.id);
        }
      }
    });

    await Promise.allSettled(pushPromises);
    console.log(`🔔 Push notifications sent to ${subscriptions.length} devices`);
  }

  /**
   * Envoyer Web Push via service worker
   */
  private async sendWebPush(
    endpoint: string,
    keys: { p256dh: string; auth: string },
    payload: {
      title: string;
      body: string;
      icon?: string;
      badge?: string;
      data?: Record<string, any>;
    }
  ): Promise<void> {
    // Utiliser web-push library
    const webpush = await import('web-push');

    webpush.setVapidDetails(
      'mailto:admin@vyxo.app',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );

    await webpush.sendNotification(
      {
        endpoint,
        keys: {
          p256dh: keys.p256dh,
          auth: keys.auth,
        },
      },
      JSON.stringify(payload)
    );
  }

  /**
   * Générer template email HTML
   */
  private generateEmailTemplate(payload: NotificationPayload, userName: string): string {
    const { title, message, actionUrl, type } = payload;

    // Emoji par type
    const typeEmojis: Record<NotificationType, string> = {
      streak_milestone: '🔥',
      streak_risk: '⚠️',
      badge_awarded: '🏆',
      vyxo_flash_ready: '⚡',
      challenge_assigned: '🎯',
      duel_challenge: '⚔️',
      validation_required: '✅',
      incident_created: '🚨',
    };

    const emoji = typeEmojis[type] || '📬';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
    }
    .emoji {
      font-size: 48px;
      margin-bottom: 16px;
    }
    h1 {
      color: #0891b2;
      font-size: 24px;
      margin: 0 0 16px 0;
    }
    .message {
      font-size: 16px;
      color: #555;
      margin-bottom: 24px;
    }
    .cta-button {
      display: inline-block;
      padding: 12px 32px;
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      text-align: center;
    }
    .footer {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e5e5;
      text-align: center;
      font-size: 14px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="emoji">${emoji}</div>
      <h1>${title}</h1>
    </div>
    <div class="message">
      <p>Bonjour ${userName},</p>
      <p>${message}</p>
    </div>
    ${actionUrl ? `
    <div style="text-align: center;">
      <a href="${actionUrl}" class="cta-button">
        Voir maintenant
      </a>
    </div>
    ` : ''}
    <div class="footer">
      <p><strong>Vyxo Codex</strong> - Plateforme de montée en compétences</p>
      <p style="font-size: 12px;">
        Vous recevez cet email car vous êtes inscrit sur Vyxo Codex.
        <br>
        <a href="https://vyxo.app/preferences" style="color: #0891b2;">Gérer mes préférences</a>
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Marquer notifications comme lues
   */
  async markAsRead(notificationIds: string[]): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .in('id', notificationIds);

    if (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  }

  /**
   * Récupérer notifications non lues
   */
  async getUnread(userId: string, limit = 20): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch unread notifications:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Nettoyer anciennes notifications (30+ jours)
   */
  async cleanOldNotifications(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { error } = await this.supabase
      .from('notifications')
      .delete()
      .eq('read', true)
      .lt('created_at', thirtyDaysAgo.toISOString());

    if (error) {
      console.error('Failed to clean old notifications:', error);
    } else {
      console.log('✅ Old notifications cleaned');
    }
  }
}

/**
 * Helper functions pour créer des notifications typées
 */

export async function notifyStreakMilestone(
  userId: string,
  streak: number,
  channels: NotificationChannel[] = ['in_app']
): Promise<void> {
  const service = new NotificationService();

  await service.send({
    userId,
    type: 'streak_milestone',
    title: `🔥 ${streak} jours de série !`,
    message: `Félicitations ! Tu maintiens ta série depuis ${streak} jours. Continue comme ça !`,
    channels,
    priority: streak >= 30 ? 'high' : 'normal',
    actionUrl: '/dashboard',
    data: { streak },
  });
}

export async function notifyStreakRisk(
  userId: string,
  currentStreak: number,
  channels: NotificationChannel[] = ['in_app', 'push']
): Promise<void> {
  const service = new NotificationService();

  await service.send({
    userId,
    type: 'streak_risk',
    title: '⚠️ Ta série est en danger',
    message: `Tu as une série de ${currentStreak} jours ! N'oublie pas de valider ton défi aujourd'hui.`,
    channels,
    priority: 'urgent',
    actionUrl: '/challenge',
    data: { currentStreak },
  });
}

export async function notifyBadgeAwarded(
  userId: string,
  badgeId: string,
  badgeName: string,
  channels: NotificationChannel[] = ['in_app', 'email']
): Promise<void> {
  const service = new NotificationService();

  await service.send({
    userId,
    type: 'badge_awarded',
    title: `🏆 Badge débloqué : ${badgeName}`,
    message: `Bravo ! Tu viens de débloquer le badge "${badgeName}". Consulte ta collection.`,
    channels,
    priority: 'high',
    actionUrl: '/badges',
    data: { badgeId, badgeName },
  });
}

export async function notifyVyxoFlashReady(
  managerId: string,
  teamName: string,
  flashTitle: string,
  channels: NotificationChannel[] = ['in_app', 'push']
): Promise<void> {
  const service = new NotificationService();

  await service.send({
    userId: managerId,
    type: 'vyxo_flash_ready',
    title: '⚡ Nouveau Vyxo Flash disponible',
    message: `Le briefing du jour pour l'équipe ${teamName} est prêt : "${flashTitle}"`,
    channels,
    priority: 'high',
    actionUrl: '/manager/vyxo-flash',
    data: { teamName, flashTitle },
  });
}

export async function notifyChallengeAssigned(
  userId: string,
  challengeType: string,
  channels: NotificationChannel[] = ['in_app']
): Promise<void> {
  const service = new NotificationService();

  await service.send({
    userId,
    type: 'challenge_assigned',
    title: '🎯 Nouveau défi quotidien',
    message: `Ton défi du jour est prêt : ${challengeType}. Prends 2 minutes pour le compléter !`,
    channels,
    priority: 'normal',
    actionUrl: '/challenge',
    data: { challengeType },
  });
}

export async function notifyDuelChallenge(
  userId: string,
  challengerName: string,
  channels: NotificationChannel[] = ['in_app', 'push']
): Promise<void> {
  const service = new NotificationService();

  await service.send({
    userId,
    type: 'duel_challenge',
    title: '⚔️ Défi en duel !',
    message: `${challengerName} te défie en duel ! Accepte le challenge et montre tes compétences.`,
    channels,
    priority: 'high',
    actionUrl: '/duels',
    data: { challengerName },
  });
}

export async function notifyValidationRequired(
  managerId: string,
  operatorName: string,
  incidentType: string,
  channels: NotificationChannel[] = ['in_app', 'push']
): Promise<void> {
  const service = new NotificationService();

  await service.send({
    userId: managerId,
    type: 'validation_required',
    title: '✅ Validation requise',
    message: `${operatorName} a soumis une validation pour : ${incidentType}`,
    channels,
    priority: 'high',
    actionUrl: '/manager/validations',
    data: { operatorName, incidentType },
  });
}

export async function notifyIncidentCreated(
  teamMemberId: string,
  incidentTitle: string,
  channels: NotificationChannel[] = ['in_app']
): Promise<void> {
  const service = new NotificationService();

  await service.send({
    userId: teamMemberId,
    type: 'incident_created',
    title: '🚨 Nouvel incident signalé',
    message: `Un incident a été signalé dans ton équipe : "${incidentTitle}"`,
    channels,
    priority: 'normal',
    actionUrl: '/incidents',
    data: { incidentTitle },
  });
}
