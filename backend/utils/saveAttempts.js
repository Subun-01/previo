const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Save a user attempt to the DB.
 */
async function saveAttempt({
  userId, question, answer, topic, day, questionType, instantFeedback, instantScore, roadmap, targetRole
}) {
  const { error } = await supabase.from('question_attempts').insert([{
    user_id: userId,
    question,
    answer,
    topic,
    day,
    question_type: questionType,
    instant_feedback: instantFeedback,
    instant_score: instantScore,
    roadmap,
    target_role: targetRole,
    timestamp: new Date().toISOString()
  }]);
  if (error) throw new Error(error.message);
}

module.exports = { saveAttempt };