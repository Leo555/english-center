import type { UnitData } from '../../types'
import { w, unit } from './words'

// ---------------- Level 6 (PET, ~1600 词，每单元约 11 词) ----------------
const L6_U1 = unit('L6', 1, '学术写作', 'Academic Writing', [
  w('essay', '文章', '/ˈeseɪ/', '📄', 'I write an essay about my hometown.', '我写了一篇关于家乡的文章。'),
  w('paragraph', '段落', '/ˈpærəɡræf/', '📝', 'Each paragraph has a main idea.', '每个段落都有一个中心思想。'),
  w('thesis', '论点', '/ˈθiːsɪs/', '🎯', 'State your thesis clearly.', '清楚地陈述你的论点。'),
  w('outline', '大纲', '/ˈaʊtlaɪn/', '📋', 'Make an outline before you write.', '写作前先列一个大纲。'),
  w('draft', '草稿', '/dræft/', '✏️', 'This is my first draft.', '这是我的初稿。'),
  w('revise', '修改', '/rɪˈvaɪz/', '🔁', 'I revise my essay carefully.', '我仔细修改我的文章。'),
  w('citation', '引用', '/saɪˈteɪʃn/', '📑', 'Add a citation for this fact.', '为这个事实添加一个引用。'),
  w('reference', '参考文献', '/ˈrefrəns/', '📚', 'List your references at the end.', '在结尾列出你的参考文献。'),
  w('plagiarism', '抄袭', '/ˈpleɪdʒərɪzəm/', '🚫', 'Plagiarism is not allowed.', '抄袭是不被允许的。'),
  w('formal', '正式的', '/ˈfɔːrml/', '🎩', 'Use formal language in the report.', '在报告中使用正式的语言。'),
  w('structure', '结构', '/ˈstrʌktʃər/', '🏗️', 'The essay has a clear structure.', '这篇文章结构清晰。'),
], '📄')
const L6_U2 = unit('L6', 2, '议论文表达', 'Argumentative Essay', [
  w('argue', '论证', '/ˈɑːrɡjuː/', '🗣️', 'He argues for more free time.', '他为争取更多自由时间而论证。'),
  w('claim', '主张', '/kleɪm/', '📢', 'Her claim is not supported.', '她的主张没有得到支持。'),
  w('counterargument', '反驳论点', '/ˈkaʊntərɑːrɡjumənt/', '↔️', 'Consider the counterargument.', '考虑一下反驳论点。'),
  w('support', '支持', '/səˈpɔːrt/', '🤝', 'Use facts to support your idea.', '用事实来支持你的观点。'),
  w('refute', '反驳', '/rɪˈfjuːt/', '❌', 'She refutes his claim easily.', '她轻松地反驳了他的主张。'),
  w('perspective', '观点', '/pərˈspektɪv/', '👀', 'Consider a different perspective.', '考虑一个不同的观点。'),
  w('bias', '偏见', '/ˈbaɪəs/', '⚖️', 'The report shows some bias.', '这份报告显示出一些偏见。'),
  w('logical', '逻辑的', '/ˈlɑːdʒɪkl/', '🧩', 'His answer is very logical.', '他的回答非常合乎逻辑。'),
  w('convincing', '有说服力的', '/kənˈvɪnsɪŋ/', '💪', 'Her speech is very convincing.', '她的演讲很有说服力。'),
  w('rebuttal', '反驳', '/rɪˈbʌtl/', '🔙', 'He gives a strong rebuttal.', '他做出了强有力的反驳。'),
  w('stance', '立场', '/stæns/', '🧍', 'What is your stance on this issue?', '你在这个问题上的立场是什么？'),
], '🗣️')
const L6_U3 = unit('L6', 3, '全球议题', 'Global Issues', [
  w('globalization', '全球化', '/ˌɡloʊbələˈzeɪʃn/', '🌐', 'Globalization connects the world.', '全球化连接了世界。'),
  w('climate change', '气候变化', '/ˈklaɪmət tʃeɪndʒ/', '🌡️', 'Climate change affects everyone.', '气候变化影响着每一个人。'),
  w('sustainability', '可持续性', '/səˌsteɪnəˈbɪləti/', '♻️', 'Sustainability is important for the planet.', '可持续性对地球很重要。'),
  w('inequality', '不平等', '/ˌɪnɪˈkwɑːləti/', '⚖️', 'We should fight inequality.', '我们应该对抗不平等。'),
  w('human rights', '人权', '/ˈhjuːmən raɪts/', '✊', 'Human rights matter to everyone.', '人权对每个人都很重要。'),
  w('immigration', '移民', '/ˌɪmɪˈɡreɪʃn/', '🛂', 'Immigration policy is debated a lot.', '移民政策备受争议。'),
  w('cybersecurity', '网络安全', '/ˈsaɪbərsɪˌkjʊrəti/', '🔒', 'Cybersecurity protects our data.', '网络安全保护我们的数据。'),
  w('overpopulation', '人口过剩', '/ˌoʊvərpɑːpjuˈleɪʃn/', '👥', 'Overpopulation causes many problems.', '人口过剩引发了很多问题。'),
  w('refugee', '难民', '/ˌrefjuˈdʒiː/', '🏕️', 'The refugees need help.', '难民们需要帮助。'),
  w('diplomacy', '外交', '/dɪˈploʊməsi/', '🤝', 'Diplomacy can solve conflicts.', '外交可以解决冲突。'),
  w('crisis', '危机', '/ˈkraɪsɪs/', '⚠️', 'The world faces a water crisis.', '世界面临水资源危机。'),
], '🌐')
const L6_U4 = unit('L6', 4, '文学赏析', 'Literature Appreciation', [
  w('novel', '小说', '/ˈnɑːvl/', '📕', 'I am reading a great novel.', '我在读一本很棒的小说。'),
  w('poem', '诗', '/ˈpoʊəm/', '📜', 'She writes a beautiful poem.', '她写了一首美丽的诗。'),
  w('metaphor', '隐喻', '/ˈmetəfər/', '🌉', 'The writer uses a strong metaphor.', '作者用了一个强有力的隐喻。'),
  w('symbolism', '象征主义', '/ˈsɪmbəlɪzəm/', '🕊️', 'The dove is a symbol of peace.', '鸽子是和平的象征。'),
  w('protagonist', '主角', '/proʊˈtæɡənɪst/', '🦸', 'The protagonist is very brave.', '主角非常勇敢。'),
  w('plot', '情节', '/plɑːt/', '📖', 'The plot is exciting.', '这个情节很精彩。'),
  w('theme', '主题', '/θiːm/', '💡', 'The theme of the story is friendship.', '这个故事的主题是友谊。'),
  w('irony', '讽刺', '/ˈaɪərəni/', '🎭', 'The ending has a touch of irony.', '结尾带有一丝讽刺意味。'),
  w('narrator', '叙述者', '/ˈnæreɪtər/', '🗣️', 'The narrator tells the story.', '叙述者讲述这个故事。'),
  w('genre', '体裁', '/ˈʒɑːnrə/', '📚', 'Mystery is my favorite genre.', '悬疑小说是我最喜欢的体裁。'),
  w('tone', '语气', '/toʊn/', '🎼', 'The tone of the poem is sad.', '这首诗的语气是悲伤的。'),
], '📕')
const L6_U5 = unit('L6', 5, '演讲技巧', 'Public Speaking', [
  w('speech', '演讲', '/spiːtʃ/', '🎤', 'She gives a great speech.', '她做了一个很棒的演讲。'),
  w('audience', '观众', '/ˈɔːdiəns/', '👥', 'The audience listens carefully.', '观众认真听讲。'),
  w('gesture', '手势', '/ˈdʒestʃər/', '👋', 'He uses hand gestures.', '他使用手势。'),
  w('pitch', '音调', '/pɪtʃ/', '🎵', 'Change your pitch to sound interesting.', '改变你的音调让声音更有趣。'),
  w('eye contact', '眼神交流', '/aɪ ˈkɑːntækt/', '👁️', 'Keep eye contact with the audience.', '与观众保持眼神交流。'),
  w('pause', '停顿', '/pɔːz/', '⏸️', 'Take a pause before the answer.', '回答前先停顿一下。'),
  w('rehearse', '排练', '/rɪˈhɜːrs/', '🔁', 'We rehearse our speech.', '我们排练演讲。'),
  w('articulate', '清晰表达', '/ɑːrˈtɪkjuleɪt/', '🗣️', 'She can articulate her ideas well.', '她能清晰地表达自己的想法。'),
  w('persuasive', '有说服力的', '/pərˈsweɪsɪv/', '💪', 'His speech is very persuasive.', '他的演讲很有说服力。'),
  w('presentation', '演示', '/ˌpriːzenˈteɪʃn/', '📊', 'I give a presentation in class.', '我在课堂上做演示。'),
  w('feedback', '反馈', '/ˈfiːdbæk/', '💬', 'The teacher gives useful feedback.', '老师给出了有用的反馈。'),
], '🎤')
const L6_U6 = unit('L6', 6, '批判思维', 'Critical Thinking', [
  w('analyze', '分析', '/ˈænəlaɪz/', '🔍', 'We analyze the data carefully.', '我们仔细分析数据。'),
  w('evaluate', '评估', '/ɪˈvæljueɪt/', '📊', 'Evaluate the results of the test.', '评估测试的结果。'),
  w('assumption', '假设', '/əˈsʌmpʃn/', '💭', "Don't make an assumption.", '不要做假设。'),
  w('hypothesis', '假说', '/haɪˈpɑːθəsɪs/', '🧪', 'The scientist tests her hypothesis.', '科学家验证她的假说。'),
  w('logic', '逻辑', '/ˈlɑːdʒɪk/', '🧩', 'His logic is very clear.', '他的逻辑非常清晰。'),
  w('fallacy', '谬误', '/ˈfæləsi/', '❌', 'That is a common fallacy.', '那是一个常见的谬误。'),
  w('objective', '客观的', '/əbˈdʒektɪv/', '📏', 'Try to stay objective.', '尽量保持客观。'),
  w('subjective', '主观的', '/səbˈdʒektɪv/', '💭', 'This opinion is subjective.', '这个观点是主观的。'),
  w('rational', '理性的', '/ˈræʃənl/', '🧠', 'Make a rational decision.', '做一个理性的决定。'),
  w('skeptical', '怀疑的', '/ˈskeptɪkl/', '🤔', 'I am skeptical about this idea.', '我对这个想法持怀疑态度。'),
  w('inference', '推论', '/ˈɪnfərəns/', '🧠', 'We make an inference from the clues.', '我们从线索中做出推论。'),
], '🧠')
const L6_U7 = unit('L6', 7, '跨学科阅读', 'Interdisciplinary Reading', [
  w('interdisciplinary', '跨学科的', '/ˌɪntərdɪsəˈplɪneri/', '🔗', 'This is an interdisciplinary project.', '这是一个跨学科的项目。'),
  w('philosophy', '哲学', '/fəˈlɑːsəfi/', '🤔', 'He studies philosophy at university.', '他在大学学习哲学。'),
  w('psychology', '心理学', '/saɪˈkɑːlədʒi/', '🧠', 'Psychology explains human behavior.', '心理学解释人类行为。'),
  w('sociology', '社会学', '/ˌsoʊsiˈɑːlədʒi/', '👥', 'Sociology studies society.', '社会学研究社会。'),
  w('chemistry', '化学', '/ˈkemɪstri/', '🧪', 'Chemistry class is fun.', '化学课很有趣。'),
  w('physics', '物理', '/ˈfɪzɪks/', '⚛️', 'Physics explains how things move.', '物理解释事物如何运动。'),
  w('literature', '文学', '/ˈlɪtərətʃər/', '📚', 'I enjoy classic literature.', '我喜欢经典文学。'),
  w('statistics', '统计学', '/stəˈtɪstɪks/', '📊', 'Statistics helps us understand data.', '统计学帮助我们理解数据。'),
  w('anthropology', '人类学', '/ˌænθrəˈpɑːlədʒi/', '🗿', 'Anthropology studies human culture.', '人类学研究人类文化。'),
  w('ethics', '伦理学', '/ˈeθɪks/', '⚖️', 'We discuss ethics in class.', '我们在课堂上讨论伦理学。'),
  w('biology', '生物学', '/baɪˈɑːlədʒi/', '🧬', 'Biology is about living things.', '生物学是关于生物的学科。'),
], '🔗')
const L6_U8 = unit('L6', 8, '模拟考场', 'Mock Exam', [
  w('mock exam', '模拟考试', '/mɑːk ɪɡˈzæm/', '📝', 'We take a mock exam this week.', '我们这周进行模拟考试。'),
  w('multiple choice', '选择题', '/ˈmʌltɪpl tʃɔɪs/', '☑️', 'This test has multiple choice questions.', '这次测试有选择题。'),
  w('essay question', '论述题', '/ˈeseɪ ˈkwestʃən/', '📄', 'The essay question is difficult.', '这道论述题很难。'),
  w('time limit', '时间限制', '/taɪm ˈlɪmɪt/', '⏱️', 'There is a time limit for the test.', '考试有时间限制。'),
  w('instructions', '说明', '/ɪnˈstrʌkʃnz/', '📋', 'Read the instructions carefully.', '仔细阅读说明。'),
  w('grade', '成绩', '/ɡreɪd/', '🎯', 'I got a good grade.', '我得到了一个好成绩。'),
  w('pass', '通过', '/pæs/', '✅', 'I hope to pass the exam.', '我希望能通过考试。'),
  w('fail', '不及格', '/feɪl/', '❌', 'He is worried about failing.', '他担心考试不及格。'),
  w('cram', '突击复习', '/kræm/', '📚', 'I cram for the test the night before.', '我在考试前一晚突击复习。'),
  w('exam hall', '考场', '/ɪɡˈzæm hɔːl/', '🏫', 'We enter the exam hall quietly.', '我们安静地进入考场。'),
  w('invigilator', '监考员', '/ɪnˈvɪdʒɪleɪtər/', '👀', 'The invigilator watches the students.', '监考员看着学生们。'),
], '📝')
const L6_U9 = unit('L6', 9, '毕业挑战（复习）', 'Graduation Challenge', [
  w('graduate', '毕业', '/ˈɡrædʒueɪt/', '🎓', 'She will graduate next year.', '她明年将毕业。'),
  w('diploma', '毕业证书', '/dɪˈploʊmə/', '📜', 'He receives his diploma.', '他领取了他的毕业证书。'),
  w('ceremony', '仪式', '/ˈserəmoʊni/', '🎊', 'The graduation ceremony is exciting.', '毕业典礼令人兴奋。'),
  w('accomplishment', '成就', '/əˈkɑːmplɪʃmənt/', '🏆', 'Graduating is a big accomplishment.', '毕业是一项巨大的成就。'),
  w('farewell', '告别', '/ferˈwel/', '👋', 'We say farewell to our teachers.', '我们向老师们告别。'),
  w('aspiration', '志向', '/ˌæspəˈreɪʃn/', '🌟', 'Her aspiration is to travel the world.', '她的志向是环游世界。'),
  w('memory', '记忆', '/ˈmeməri/', '💭', 'I have many good memories at school.', '我在学校有很多美好的记忆。'),
  w('gratitude', '感激', '/ˈɡrætɪtuːd/', '🙏', 'I feel gratitude for my teachers.', '我对我的老师们心怀感激。'),
  w('reflect', '反思', '/rɪˈflekt/', '🪞', 'We reflect on our school years.', '我们反思我们的学校岁月。'),
  w('cap and gown', '学位服', '/kæp ənd ɡaʊn/', '🎓', 'Students wear a cap and gown.', '学生们穿着学位服。'),
  w('yearbook', '纪念册', '/ˈjɪrbʊk/', '📔', 'Sign my yearbook, please.', '请在我的纪念册上签名。'),
], '🎓')

export const L6_UNITS: UnitData[] = [
  L6_U1, L6_U2, L6_U3, L6_U4, L6_U5, L6_U6, L6_U7, L6_U8, L6_U9,
]
