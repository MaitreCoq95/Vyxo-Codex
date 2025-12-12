import { createClient } from '@supabase/supabase-js';
import jsPDF from 'jspdf';

interface Badge {
  id: string;
  title: string;
  description: string;
  category: 'skill' | 'milestone' | 'achievement';
  icon: string;
  linkedinShareable: boolean;
  pdfCertificate: boolean;
  criteria: {
    modules?: string[];
    minScore?: number;
    practicalValidation?: boolean;
    streakDays?: number;
    contributionCount?: number;
  };
}

export async function checkBadgeEligibility(userId: string, badgeId: string): Promise<boolean> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const { data: badge } = await supabase
    .from('badges')
    .select('*')
    .eq('id', badgeId)
    .single();
    
  if (!badge) return false;
  
  const criteria = badge.criteria as Badge['criteria'];
  
  // Vérifier critères selon le badge
  if (criteria.modules) {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .in('module_id', criteria.modules);
      
    const allCompleted = progress?.every(p => 
      p.status === 'completed' && 
      p.score >= (criteria.minScore || 0) &&
      (!criteria.practicalValidation || p.mastery_level >= 3)
    );
    
    if (!allCompleted) return false;
  }
  
  if (criteria.streakDays) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak')
      .eq('id', userId)
      .single();
      
    if ((profile?.current_streak || 0) < criteria.streakDays && 
        (profile?.longest_streak || 0) < criteria.streakDays) {
      return false;
    }
  }
  
  return true;
}

export async function awardBadge(userId: string, badgeId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const { data: badge } = await supabase
    .from('badges')
    .select('*')
    .eq('id', badgeId)
    .single();
    
  if (!badge) throw new Error('Badge not found');
  
  // Vérifier si déjà obtenu
  const { data: existing } = await supabase
    .from('badge_awards')
    .select('id')
    .eq('user_id', userId)
    .eq('badge_id', badgeId)
    .single();
    
  if (existing) {
    console.log(`Badge ${badgeId} already awarded to user ${userId}`);
    return existing;
  }
  
  // Créer l'attribution
  const { data: award, error } = await supabase
    .from('badge_awards')
    .insert({
      user_id: userId,
      badge_id: badgeId,
      awarded_at: new Date().toISOString(),
    })
    .select()
    .single();
    
  if (error) throw error;
  
  // Générer certificat PDF si requis
  if (badge.pdf_certificate) {
    const certificateUrl = await generateCertificatePDF(userId, badge, award.id);
    
    await supabase
      .from('badge_awards')
      .update({ certificate_url: certificateUrl })
      .eq('id', award.id);
  }
  
  // Si niveau Mentor, update profil
  if (badgeId === 'mentor-level') {
    await supabase
      .from('profiles')
      .update({ mentor_level: true })
      .eq('id', userId);
  }
  
  console.log(`✅ Badge ${badgeId} awarded to user ${userId}`);
  
  return award;
}

async function generateCertificatePDF(userId: string, badge: any, awardId: string): Promise<string> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const { data: user } = await supabase
    .from('profiles')
    .select('full_name, company_id')
    .eq('id', userId)
    .single();
    
  // Générer PDF
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  
  // Design certificat professionnel
  pdf.setFillColor(249, 250, 251);
  pdf.rect(0, 0, 297, 210, 'F');
  
  // Bordure
  pdf.setDrawColor(59, 130, 246);
  pdf.setLineWidth(2);
  pdf.rect(10, 10, 277, 190);
  
  // Logo / Icon badge
  pdf.setFontSize(48);
  pdf.text(badge.icon, 148.5, 50, { align: 'center' });
  
  // Titre
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(28);
  pdf.setTextColor(31, 41, 55);
  pdf.text('CERTIFICAT DE COMPÉTENCE', 148.5, 75, { align: 'center' });
  
  // Ligne décorative
  pdf.setDrawColor(59, 130, 246);
  pdf.setLineWidth(0.5);
  pdf.line(80, 80, 217, 80);
  
  // Décerné à
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.text('Décerné à', 148.5, 95, { align: 'center' });
  
  // Nom
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(59, 130, 246);
  pdf.text(user?.full_name || 'N/A', 148.5, 110, { align: 'center' });
  
  // Badge title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(31, 41, 55);
  pdf.text(badge.title, 148.5, 130, { align: 'center' });
  
  // Description
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  const splitDescription = pdf.splitTextToSize(badge.description, 200);
  pdf.text(splitDescription, 148.5, 140, { align: 'center' });
  
  // Infos bottom
  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  pdf.text(`Date d'obtention : ${new Date().toLocaleDateString('fr-FR')}`, 148.5, 165, { align: 'center' });
  
  // QR Code pour vérification (URL à implémenter)
  pdf.text(`Certificat #${awardId.slice(0, 8)}`, 148.5, 185, { align: 'center' });
  pdf.text('Vérifiable sur vyxocodex.com', 148.5, 192, { align: 'center' });
  
  // Convertir en Blob et upload
  const pdfBlob = pdf.output('blob');
  const fileName = `${userId}/${badge.id}_${Date.now()}.pdf`;
  
  const { data, error } = await supabase.storage
    .from('certificates')
    .upload(fileName, pdfBlob, {
      contentType: 'application/pdf',
      upsert: false
    });
    
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('certificates')
    .getPublicUrl(fileName);
    
  return publicUrl;
}
