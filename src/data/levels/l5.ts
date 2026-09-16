import type { UnitData } from '../../types'
import { w, unit } from './words'

// ---------------- Level 5 (KET, ~1300 词，每单元约 11 词) ----------------
const L5_U1 = unit('L5', 1, '媒体与新闻', 'Media & News', [
  w('newspaper', '报纸', '/ˈnuːzpeɪpər/', '📰', 'Dad reads the newspaper.', '爸爸读报纸。'),
  w('magazine', '杂志', '/ˈmæɡəziːn/', '📖', 'I read a fashion magazine.', '我读一本时尚杂志。'),
  w('headline', '头条', '/ˈhedlaɪn/', '📰', 'The headline is about the storm.', '头条新闻是关于风暴的。'),
  w('reporter', '记者', '/rɪˈpɔːrtər/', '🎤', 'The reporter asks questions.', '记者提出问题。'),
  w('broadcast', '广播', '/ˈbrɔːdkæst/', '📡', 'The news is broadcast live.', '新闻是现场直播的。'),
  w('interview', '采访', '/ˈɪntərvjuː/', '🎙️', 'She interviews the mayor.', '她采访市长。'),
  w('article', '文章', '/ˈɑːrtɪkl/', '📄', 'I write an article about pandas.', '我写了一篇关于熊猫的文章。'),
  w('media', '媒体', '/ˈmiːdiə/', '📺', 'Social media is popular now.', '社交媒体现在很流行。'),
  w('advertisement', '广告', '/ˌædvərˈtaɪzmənt/', '📢', 'I see an advertisement on TV.', '我在电视上看到一个广告。'),
  w('audience', '观众', '/ˈɔːdiəns/', '👥', 'The audience claps loudly.', '观众大声鼓掌。'),
  w('publish', '出版', '/ˈpʌblɪʃ/', '📚', 'The writer publishes a new book.', '作家出版了一本新书。'),
], '📰')
const L5_U2 = unit('L5', 2, '社会话题', 'Social Topics', [
  w('community', '社区', '/kəˈmjuːnəti/', '🏘️', 'We help our community.', '我们帮助我们的社区。'),
  w('volunteer', '志愿者', '/ˌvɑːlənˈtɪr/', '🙋', 'She works as a volunteer.', '她当志愿者。'),
  w('charity', '慈善', '/ˈtʃærəti/', '❤️', 'We give money to charity.', '我们向慈善机构捐款。'),
  w('poverty', '贫困', '/ˈpɑːvərti/', '🏚️', 'The program helps fight poverty.', '这个项目帮助对抗贫困。'),
  w('equality', '平等', '/iˈkwɑːləti/', '⚖️', 'Everyone deserves equality.', '每个人都应享有平等。'),
  w('diversity', '多样性', '/daɪˈvɜːrsəti/', '🌈', 'Our school celebrates diversity.', '我们学校推崇多样性。'),
  w('tradition', '传统', '/trəˈdɪʃn/', '🏮', 'We follow an old tradition.', '我们遵循一个古老的传统。'),
  w('generation', '一代', '/ˌdʒenəˈreɪʃn/', '👨‍👩‍👧‍👦', 'Three generations live together.', '三代人住在一起。'),
  w('respect', '尊重', '/rɪˈspekt/', '🙏', 'We respect our teachers.', '我们尊重我们的老师。'),
  w('responsibility', '责任', '/rɪˌspɑːnsəˈbɪləti/', '📋', 'It is my responsibility.', '这是我的责任。'),
  w('cooperation', '合作', '/koʊˌɑːpəˈreɪʃn/', '🤝', 'Cooperation makes work easier.', '合作让工作更轻松。'),
], '🏘️')
const L5_U3 = unit('L5', 3, '世界文化', 'World Cultures', [
  w('culture', '文化', '/ˈkʌltʃər/', '🎭', 'I learn about Chinese culture.', '我学习中国文化。'),
  w('custom', '习俗', '/ˈkʌstəm/', '🏮', 'It is a local custom.', '这是当地的一个习俗。'),
  w('heritage', '遗产', '/ˈherɪtɪdʒ/', '🏯', 'The Great Wall is our heritage.', '长城是我们的遗产。'),
  w('costume', '服装', '/ˈkɑːstuːm/', '👘', 'She wears a traditional costume.', '她穿着传统服装。'),
  w('ceremony', '仪式', '/ˈserəmoʊni/', '🎊', 'The ceremony starts at noon.', '仪式在中午开始。'),
  w('religion', '宗教', '/rɪˈlɪdʒən/', '🙏', 'There are many religions in the world.', '世界上有很多宗教。'),
  w('ethnic', '民族的', '/ˈeθnɪk/', '🌍', 'This is an ethnic dance.', '这是一种民族舞蹈。'),
  w('folklore', '民间传说', '/ˈfoʊklɔːr/', '📖', 'The story is part of local folklore.', '这个故事是当地民间传说的一部分。'),
  w('cuisine', '美食', '/kwɪˈziːn/', '🍜', 'I love Italian cuisine.', '我喜欢意大利美食。'),
  w('celebration', '庆典', '/ˌselɪˈbreɪʃn/', '🎉', 'The whole town joins the celebration.', '整个镇子都参加庆典。'),
  w('landmark', '地标', '/ˈlændmɑːrk/', '🗽', 'The tower is a famous landmark.', '这座塔是著名的地标。'),
], '🎭')
const L5_U4 = unit('L5', 4, '科技生活', 'Technology Life', [
  w('software', '软件', '/ˈsɔːftwer/', '💽', 'I install new software.', '我安装新软件。'),
  w('hardware', '硬件', '/ˈhɑːrdwer/', '🖥️', "The computer's hardware is old.", '这台电脑的硬件很旧了。'),
  w('application', '应用程序', '/ˌæplɪˈkeɪʃn/', '📱', 'I open a chat application.', '我打开一个聊天应用程序。'),
  w('download', '下载', '/ˈdaʊnloʊd/', '⬇️', 'I download a new song.', '我下载了一首新歌。'),
  w('upload', '上传', '/ˈʌploʊd/', '⬆️', 'She uploads photos online.', '她把照片上传到网上。'),
  w('network', '网络', '/ˈnetwɜːrk/', '🌐', 'The network is very fast.', '这个网络非常快。'),
  w('password', '密码', '/ˈpæswɜːrd/', '🔑', "Don't share your password.", '别泄露你的密码。'),
  w('database', '数据库', '/ˈdeɪtəbeɪs/', '🗄️', 'The company has a big database.', '这家公司有一个大型数据库。'),
  w('server', '服务器', '/ˈsɜːrvər/', '🖥️', 'The server is down.', '服务器宕机了。'),
  w('browser', '浏览器', '/ˈbraʊzər/', '🌐', 'I open a web browser.', '我打开一个网络浏览器。'),
  w('update', '更新', '/ʌpˈdeɪt/', '🔄', 'Please update the app.', '请更新这个应用。'),
], '💻')
const L5_U5 = unit('L5', 5, '自然灾害', 'Natural Disasters', [
  w('earthquake', '地震', '/ˈɜːrθkweɪk/', '🌋', 'An earthquake shook the city.', '一场地震震动了这座城市。'),
  w('flood', '洪水', '/flʌd/', '🌊', 'The flood damaged many houses.', '洪水损坏了很多房屋。'),
  w('hurricane', '飓风', '/ˈhɜːrəkeɪn/', '🌀', 'A hurricane is coming.', '一场飓风要来了。'),
  w('tsunami', '海啸', '/tsuːˈnɑːmi/', '🌊', 'The tsunami hit the coast.', '海啸袭击了海岸。'),
  w('drought', '干旱', '/draʊt/', '☀️', 'The drought killed the crops.', '干旱使农作物枯死。'),
  w('wildfire', '野火', '/ˈwaɪldfaɪər/', '🔥', 'The wildfire spread quickly.', '野火迅速蔓延。'),
  w('volcano', '火山', '/vɑːlˈkeɪnoʊ/', '🌋', 'The volcano erupted.', '火山爆发了。'),
  w('disaster', '灾难', '/dɪˈzæstər/', '⚠️', 'It was a terrible disaster.', '这是一场可怕的灾难。'),
  w('evacuate', '疏散', '/ɪˈvækjueɪt/', '🏃', 'People evacuate the area.', '人们从该地区疏散。'),
  w('rescue', '救援', '/ˈreskjuː/', '🚑', 'The rescue team saves lives.', '救援队拯救生命。'),
  w('shelter', '避难所', '/ˈʃeltər/', '⛺', 'They stay in a shelter.', '他们住在避难所里。'),
], '🌋')
const L5_U6 = unit('L5', 6, '经济常识', 'Economics Basics', [
  w('economy', '经济', '/ɪˈkɑːnəmi/', '📈', 'The economy is growing.', '经济正在增长。'),
  w('budget', '预算', '/ˈbʌdʒɪt/', '💰', 'We make a family budget.', '我们制定家庭预算。'),
  w('income', '收入', '/ˈɪnkʌm/', '💵', 'His income increases every year.', '他的收入每年都在增加。'),
  w('expense', '支出', '/ɪkˈspens/', '🧾', 'We track our monthly expenses.', '我们跟踪每月的支出。'),
  w('investment', '投资', '/ɪnˈvestmənt/', '📊', 'This is a good investment.', '这是一项好的投资。'),
  w('currency', '货币', '/ˈkɜːrənsi/', '💴', 'The dollar is a strong currency.', '美元是一种强势货币。'),
  w('trade', '贸易', '/treɪd/', '🚢', 'The two countries trade goods.', '这两个国家进行商品贸易。'),
  w('profit', '利润', '/ˈprɑːfɪt/', '📈', 'The shop makes a good profit.', '这家商店获得了不错的利润。'),
  w('loss', '损失', '/lɔːs/', '📉', 'The company had a big loss.', '这家公司有一笔大损失。'),
  w('tax', '税', '/tæks/', '🧾', 'We pay tax every year.', '我们每年都交税。'),
  w('loan', '贷款', '/loʊn/', '🏦', 'He got a loan from the bank.', '他从银行获得了一笔贷款。'),
], '📈')
const L5_U7 = unit('L5', 7, '人物传记', 'Biography', [
  w('achievement', '成就', '/əˈtʃiːvmənt/', '🏆', 'Winning the prize is a great achievement.', '获奖是一项伟大的成就。'),
  w('career', '职业生涯', '/kəˈrɪr/', '💼', 'She has a long career in music.', '她有着漫长的音乐职业生涯。'),
  w('biography', '传记', '/baɪˈɑːɡrəfi/', '📖', 'I read his biography.', '我读了他的传记。'),
  w('inspire', '激励', '/ɪnˈspaɪər/', '✨', 'Her story inspires many people.', '她的故事激励了很多人。'),
  w('contribution', '贡献', '/ˌkɑːntrɪˈbjuːʃn/', '🤲', 'His contribution to science is huge.', '他对科学的贡献巨大。'),
  w('pioneer', '先驱', '/ˌpaɪəˈnɪr/', '🚩', 'She is a pioneer in medicine.', '她是医学领域的先驱。'),
  w('legacy', '遗产', '/ˈleɡəsi/', '🏛️', 'He leaves a great legacy.', '他留下了伟大的遗产。'),
  w('talent', '才能', '/ˈtælənt/', '🌟', 'He has a talent for painting.', '他有绘画的才能。'),
  w('dedication', '奉献', '/ˌdedɪˈkeɪʃn/', '💪', 'Her dedication to work is amazing.', '她对工作的奉献令人惊叹。'),
  w('milestone', '里程碑', '/ˈmaɪlstoʊn/', '🚩', 'This is a milestone in his life.', '这是他人生中的一个里程碑。'),
  w('ambition', '志向', '/æmˈbɪʃn/', '🎯', 'Her ambition is to become a doctor.', '她的志向是成为一名医生。'),
], '🏆')
const L5_U8 = unit('L5', 8, '辩论表达', 'Debate & Expression', [
  w('opinion', '观点', '/əˈpɪnjən/', '💭', 'What is your opinion?', '你的观点是什么？'),
  w('argument', '论点', '/ˈɑːrɡjumənt/', '🗣️', 'He makes a strong argument.', '他提出了一个有力的论点。'),
  w('agree', '同意', '/əˈɡriː/', '👍', 'I agree with you.', '我同意你的看法。'),
  w('disagree', '不同意', '/ˌdɪsəˈɡriː/', '👎', 'She disagrees with the plan.', '她不同意这个计划。'),
  w('persuade', '说服', '/pərˈsweɪd/', '🗨️', 'He tries to persuade his mom.', '他试图说服他的妈妈。'),
  w('debate', '辩论', '/dɪˈbeɪt/', '🎙️', 'We have a debate in class.', '我们在课堂上进行辩论。'),
  w('viewpoint', '观点', '/ˈvjuːpɔɪnt/', '👁️', 'Everyone has a different viewpoint.', '每个人都有不同的观点。'),
  w('evidence', '证据', '/ˈevɪdəns/', '🔍', 'We need more evidence.', '我们需要更多证据。'),
  w('conclusion', '结论', '/kənˈkluːʒn/', '✅', 'What is your conclusion?', '你的结论是什么？'),
  w('statement', '陈述', '/ˈsteɪtmənt/', '📝', 'He makes a clear statement.', '他做出了一个清晰的陈述。'),
  w('discussion', '讨论', '/dɪˈskʌʃn/', '💬', 'We have a discussion about the book.', '我们讨论这本书。'),
], '🗣️')
const L5_U9 = unit('L5', 9, '综合复习', 'Comprehensive Review', [
  w('review', '复习', '/rɪˈvjuː/', '🔁', 'I review my notes before the test.', '考试前我复习笔记。'),
  w('vocabulary', '词汇', '/voʊˈkæbjəleri/', '📚', 'I learn new vocabulary every day.', '我每天学习新词汇。'),
  w('grammar', '语法', '/ˈɡræmər/', '✏️', 'Grammar is important in writing.', '语法在写作中很重要。'),
  w('comprehension', '理解', '/ˌkɑːmprɪˈhenʃn/', '🧠', 'Reading comprehension takes practice.', '阅读理解需要练习。'),
  w('fluent', '流利的', '/ˈfluːənt/', '🗣️', 'She speaks fluent English.', '她说流利的英语。'),
  w('confident', '自信的', '/ˈkɑːnfɪdənt/', '😎', 'He is confident in the exam.', '他在考试中很自信。'),
  w('progress', '进步', '/ˈprɑːɡres/', '📈', 'You made great progress.', '你有了很大的进步。'),
  w('challenge', '挑战', '/ˈtʃælɪndʒ/', '🧗', 'This test is a real challenge.', '这次考试是一个真正的挑战。'),
  w('improve', '提高', '/ɪmˈpruːv/', '⬆️', 'I want to improve my writing.', '我想提高我的写作水平。'),
  w('master', '掌握', '/ˈmæstər/', '🎓', 'She wants to master English.', '她想掌握英语。'),
  w('summary', '总结', '/ˈsʌməri/', '📝', 'Write a summary of the story.', '写一个故事的总结。'),
], '🎓')

export const L5_UNITS: UnitData[] = [
  L5_U1, L5_U2, L5_U3, L5_U4, L5_U5, L5_U6, L5_U7, L5_U8, L5_U9,
]
