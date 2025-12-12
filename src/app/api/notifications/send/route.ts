/**
 * Vyxo Codex 2.0 - API Route pour envoyer des notifications
 * POST /api/notifications/send
 */

import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/lib/notifications/notification-service';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const SendNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum([
    'streak_milestone',
    'streak_risk',
    'badge_awarded',
    'vyxo_flash_ready',
    'challenge_assigned',
    'duel_challenge',
    'validation_required',
    'incident_created',
  ]),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  data: z.record(z.any()).optional(),
  channels: z.array(z.enum(['in_app', 'email', 'push'])).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  actionUrl: z.string().url().optional().or(z.string().startsWith('/')),
});

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification (service role uniquement)
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Vérifier que c'est le service role key
    if (token !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Parser et valider le body
    const body = await request.json();
    const validatedData = SendNotificationSchema.parse(body);

    // Vérifier que l'utilisateur existe
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: user } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', validatedData.userId)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Envoyer la notification
    const notificationService = new NotificationService();
    await notificationService.send(validatedData);

    return NextResponse.json({
      success: true,
      message: 'Notification sent successfully',
    });
  } catch (error) {
    console.error('Error sending notification:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/notifications/send
 * Retourne la documentation de l'API
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/notifications/send',
    method: 'POST',
    description: 'Send notifications to users across multiple channels',
    authentication: 'Service role key required',
    body: {
      userId: 'string (UUID)',
      type: 'NotificationType',
      title: 'string (1-200 chars)',
      message: 'string (1-1000 chars)',
      data: 'object (optional)',
      channels: 'array of "in_app" | "email" | "push" (optional, default: ["in_app"])',
      priority: '"low" | "normal" | "high" | "urgent" (optional, default: "normal")',
      actionUrl: 'string (URL or path, optional)',
    },
    example: {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      type: 'streak_milestone',
      title: '🔥 30 jours de série !',
      message: 'Félicitations ! Tu maintiens ta série depuis 30 jours.',
      channels: ['in_app', 'push'],
      priority: 'high',
      actionUrl: '/dashboard',
      data: { streak: 30 },
    },
  });
}
