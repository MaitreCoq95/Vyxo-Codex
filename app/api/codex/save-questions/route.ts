import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
  try {
    const { questions } = await req.json();

    if (!questions || !Array.isArray(questions)) {
      return Response.json({ error: 'Invalid questions format' }, { status: 400 });
    }

    // Chemin du fichier
    const filePath = join(process.cwd(), 'lib', 'codex', 'questions.ts');

    // Lire le fichier actuel
    const currentContent = await readFile(filePath, 'utf-8');

    // Trouver où insérer les nouvelles questions (avant le dernier ];)
    const lastBracketIndex = currentContent.lastIndexOf('];');

    if (lastBracketIndex === -1) {
      return Response.json({ error: 'Could not find questions array in file' }, { status: 500 });
    }

    // Formatter les nouvelles questions
    const newQuestionsCode = questions.map((q: any) =>
      `  ${JSON.stringify(q, null, 2).replace(/\n/g, '\n  ')},`
    ).join('\n');

    // Construire le nouveau contenu
    const beforeArray = currentContent.substring(0, lastBracketIndex);
    const afterArray = currentContent.substring(lastBracketIndex);

    const newContent = `${beforeArray}
  // ========================================
  // Questions générées par IA - ${new Date().toLocaleDateString('fr-FR')}
  // ${questions.length} questions ajoutées
  // ========================================
${newQuestionsCode}
${afterArray}`;

    // Écrire le fichier
    await writeFile(filePath, newContent, 'utf-8');

    return Response.json({
      success: true,
      message: `${questions.length} questions ajoutées avec succès !`,
      count: questions.length
    });

  } catch (error: any) {
    console.error('💥 Save Error:', error);
    return Response.json({
      error: error.message || 'Failed to save questions',
      details: error.toString()
    }, { status: 500 });
  }
}
