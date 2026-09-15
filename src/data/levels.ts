import type { LevelData, UnitData, WordItem } from '../types'

// ============================================================
// Power Up 分级词汇/句型数据
// 对标：剑桥《Power Up》教材 1-6 级（CEFR Pre-A1 ~ B1，对应剑桥 YLE/KET/PET 考试体系）
// 说明：L1、L2 已填充可直接游玩的示例词表；为降低小朋友学习难度，每个单元词量控制在 10-12 个左右
//       （L1 拆分为 27 个小单元约 300 词，L2 拆分为 24 个小单元约 288 词，均含例句）；
//       L3-L6 保留官方分级参数与单元主题骨架，词表可按同样结构继续扩充（见 README）。
// ============================================================

let uid = 0
function w(en: string, cn: string, ipa: string, emoji: string, exEn: string, exCn: string): WordItem {
  uid++
  return { id: `w${uid}-${en.replace(/\s+/g, '_')}`, en, cn, ipa, emoji, example: { en: exEn, cn: exCn } }
}

function unit(
  levelId: string,
  index: number,
  title: string,
  titleEn: string,
  words: WordItem[],
  icon?: string
): UnitData {
  return { id: `${levelId}-U${index}`, levelId, index, title, titleEn, words, icon }
}

// ---------------- Level 1 (YLE Starters, ~300 词，每单元约 10-12 词) ----------------
const L1_U1 = unit('L1', 1, '打招呼', 'Greetings', [
  w('hello', '你好', '/həˈloʊ/', '👋', 'Hello! I am Amy.', '你好！我是艾米。'),
  w('hi', '嗨', '/haɪ/', '🙋', 'Hi, friend!', '嗨，朋友！'),
  w('goodbye', '再见', '/ˌɡʊdˈbaɪ/', '🚶', 'Goodbye, see you soon!', '再见，很快见！'),
  w('bye', '拜拜', '/baɪ/', '🖐️', 'Bye, mom! I love you.', '拜拜，妈妈！我爱你。'),
  w('good morning', '早上好', '/ɡʊd ˈmɔːrnɪŋ/', '🌞', 'Good morning, teacher!', '早上好，老师！'),
  w('good afternoon', '下午好', '/ɡʊd ˌæftərˈnuːn/', '🌤️', 'Good afternoon, class!', '同学们下午好！'),
  w('good evening', '晚上好', '/ɡʊd ˈiːvnɪŋ/', '🌆', 'Good evening, everyone.', '大家晚上好。'),
  w('good night', '晚安', '/ɡʊd naɪt/', '🌙', 'Good night, sweet dreams.', '晚安，做个好梦。'),
  w('welcome', '欢迎', '/ˈwelkəm/', '🤗', 'Welcome to our school!', '欢迎来到我们学校！'),
  w('please', '请', '/pliːz/', '🥺', 'Open the door, please.', '请打开门。'),
  w('thank you', '谢谢', '/θæŋk juː/', '🙏', 'Thank you for the gift.', '谢谢你的礼物。'),
], '👋')
const L1_U2 = unit('L1', 2, '颜色乐园', 'Colors', [
  w('red', '红色', '/red/', '🔴', 'I like red.', '我喜欢红色。'),
  w('blue', '蓝色', '/bluː/', '🔵', 'The sky is blue.', '天空是蓝色的。'),
  w('yellow', '黄色', '/ˈjeloʊ/', '🟡', 'The sun is yellow.', '太阳是黄色的。'),
  w('green', '绿色', '/ɡriːn/', '🟢', 'Grass is green.', '小草是绿色的。'),
  w('black', '黑色', '/blæk/', '⚫', 'I have a black cat.', '我有一只黑猫。'),
  w('white', '白色', '/waɪt/', '⚪', 'Snow is white.', '雪是白色的。'),
  w('orange', '橙色', '/ˈɔːrɪndʒ/', '🟠', 'My kite is orange.', '我的风筝是橙色的。'),
  w('purple', '紫色', '/ˈpɜːrpl/', '🟣', 'I have a purple cup.', '我有一个紫色的杯子。'),
  w('pink', '粉色', '/pɪŋk/', '💗', 'Her dress is pink.', '她的裙子是粉色的。'),
  w('brown', '棕色', '/braʊn/', '🟤', 'The dog is brown.', '这只狗是棕色的。'),
  w('grey', '灰色', '/ɡreɪ/', '🩶', 'The mouse is grey.', '老鼠是灰色的。'),
], '🌈')
const L1_U3 = unit('L1', 3, '礼貌与朋友', 'Manners & Friends', [
  w('sorry', '对不起', '/ˈsɑːri/', '😔', 'Sorry, I broke it.', '对不起，我把它弄坏了。'),
  w('excuse me', '打扰一下', '/ɪkˈskjuːz miː/', '☝️', 'Excuse me, may I come in?', '打扰一下，我可以进来吗？'),
  w('yes', '是的', '/jes/', '✅', 'Yes, I like apples.', '是的，我喜欢苹果。'),
  w('no', '不', '/noʊ/', '❌', 'No, I am not tired.', '不，我不累。'),
  w('OK', '好的', '/ˌoʊˈkeɪ/', '👌', 'OK, let us go now.', '好的，我们现在走吧。'),
  w('name', '名字', '/neɪm/', '📛', 'What is your name?', '你叫什么名字？'),
  w('friend', '朋友', '/frend/', '🤝', 'You are my best friend.', '你是我最好的朋友。'),
  w('boy', '男孩', '/bɔɪ/', '👦', 'The boy is running.', '这个男孩在跑步。'),
  w('girl', '女孩', '/ɡɜːrl/', '👧', 'The girl is singing.', '这个女孩在唱歌。'),
  w('teacher', '老师', '/ˈtiːtʃər/', '🧑‍🏫', 'My teacher is nice.', '我的老师很好。'),
  w('clap', '拍手', '/klæp/', '👏', 'Let\'s clap our hands.', '我们一起拍手吧。'),
], '🤝')
const L1_U4 = unit('L1', 4, '数字1-10', 'Numbers 1-10', [
  w('one', '一', '/wʌn/', '1️⃣', 'I have one dog.', '我有一只狗。'),
  w('two', '二', '/tuː/', '2️⃣', 'I see two birds.', '我看见两只鸟。'),
  w('three', '三', '/θriː/', '3️⃣', 'She has three balls.', '她有三个球。'),
  w('four', '四', '/fɔːr/', '4️⃣', 'There are four cats.', '有四只猫。'),
  w('five', '五', '/faɪv/', '5️⃣', 'I have five fingers.', '我有五根手指。'),
  w('six', '六', '/sɪks/', '6️⃣', 'Six apples are red.', '六个苹果是红色的。'),
  w('seven', '七', '/ˈsevn/', '7️⃣', 'A week has seven days.', '一周有七天。'),
  w('eight', '八', '/eɪt/', '8️⃣', 'I see eight stars.', '我看见八颗星星。'),
  w('nine', '九', '/naɪn/', '9️⃣', 'I have nine crayons.', '我有九支蜡笔。'),
  w('ten', '十', '/ten/', '🔟', 'Count to ten with me.', '和我一起数到十。'),
  w('zero', '零', '/ˈzɪəroʊ/', '0️⃣', 'I have zero apples left.', '我一个苹果都没有了。'),
], '🔢')
const L1_U5 = unit('L1', 5, '数字11-20', 'Numbers 11-20', [
  w('eleven', '十一', '/ɪˈlevn/', '1️⃣1️⃣', 'There are eleven kids.', '有十一个孩子。'),
  w('twelve', '十二', '/twelv/', '1️⃣2️⃣', 'A year has twelve months.', '一年有十二个月。'),
  w('thirteen', '十三', '/ˌθɜːrˈtiːn/', '1️⃣3️⃣', 'She has thirteen stickers.', '她有十三张贴纸。'),
  w('fourteen', '十四', '/ˌfɔːrˈtiːn/', '1️⃣4️⃣', 'There are fourteen chairs.', '有十四把椅子。'),
  w('fifteen', '十五', '/ˌfɪfˈtiːn/', '1️⃣5️⃣', 'I see fifteen birds.', '我看见十五只鸟。'),
  w('sixteen', '十六', '/ˌsɪksˈtiːn/', '1️⃣6️⃣', 'He has sixteen cards.', '他有十六张卡片。'),
  w('seventeen', '十七', '/ˌsevnˈtiːn/', '1️⃣7️⃣', 'There are seventeen apples.', '有十七个苹果。'),
  w('eighteen', '十八', '/ˌeɪˈtiːn/', '1️⃣8️⃣', 'I count eighteen stars.', '我数了十八颗星星。'),
  w('nineteen', '十九', '/ˌnaɪnˈtiːn/', '1️⃣9️⃣', 'There are nineteen books.', '有十九本书。'),
  w('twenty', '二十', '/ˈtwenti/', '2️⃣0️⃣', 'I can count to twenty.', '我会数到二十。'),
], '🔟')
const L1_U6 = unit('L1', 6, '数字进阶', 'Bigger Numbers', [
  w('thirty', '三十', '/ˈθɜːrti/', '3️⃣0️⃣', 'There are thirty students.', '有三十个学生。'),
  w('forty', '四十', '/ˈfɔːrti/', '4️⃣0️⃣', 'Grandpa is forty years old.', '爷爷四十岁了。'),
  w('fifty', '五十', '/ˈfɪfti/', '5️⃣0️⃣', 'The book has fifty pages.', '这本书有五十页。'),
  w('sixty', '六十', '/ˈsɪksti/', '6️⃣0️⃣', 'An hour has sixty minutes.', '一小时有六十分钟。'),
  w('seventy', '七十', '/ˈsevnti/', '7️⃣0️⃣', 'There are seventy trees.', '有七十棵树。'),
  w('eighty', '八十', '/ˈeɪti/', '8️⃣0️⃣', 'Grandma is eighty years old.', '奶奶八十岁了。'),
  w('ninety', '九十', '/ˈnaɪnti/', '9️⃣0️⃣', 'I see ninety balloons.', '我看见九十个气球。'),
  w('hundred', '一百', '/ˈhʌndrəd/', '💯', 'I can count to one hundred.', '我会数到一百。'),
  w('first', '第一', '/fɜːrst/', '🥇', 'I am the first in line.', '我排在第一个。'),
  w('second', '第二', '/ˈsekənd/', '🥈', 'She is the second student.', '她是第二个学生。'),
  w('third', '第三', '/θɜːrd/', '🥉', 'He is the third one.', '他是第三个。'),
  w('count', '数数', '/kaʊnt/', '🔢', 'Let\'s count the stars.', '我们一起数星星吧。'),
], '💯')
const L1_U7 = unit('L1', 7, '家庭成员', 'Family Members', [
  w('mom', '妈妈', '/mɑːm/', '👩', 'I love my mom.', '我爱我的妈妈。'),
  w('dad', '爸爸', '/dæd/', '👨', 'My dad is tall.', '我爸爸很高。'),
  w('sister', '姐妹', '/ˈsɪstər/', '👧', 'This is my sister.', '这是我的姐姐。'),
  w('brother', '兄弟', '/ˈbrʌðər/', '👦', 'My brother is funny.', '我哥哥很有趣。'),
  w('grandma', '奶奶', '/ˈɡrænmɑː/', '👵', 'Grandma tells stories.', '奶奶讲故事。'),
  w('grandpa', '爷爷', '/ˈɡrænpɑː/', '👴', 'Grandpa likes tea.', '爷爷喜欢喝茶。'),
  w('baby', '宝宝', '/ˈbeɪbi/', '👶', 'The baby is cute.', '宝宝很可爱。'),
  w('aunt', '阿姨', '/ænt/', '👩‍🦱', 'My aunt is a doctor.', '我阿姨是医生。'),
  w('uncle', '叔叔', '/ˈʌŋkl/', '👨‍🦰', 'My uncle likes fishing.', '我叔叔喜欢钓鱼。'),
  w('cousin', '表亲', '/ˈkʌzn/', '🧑', 'My cousin is my age.', '我表哥和我同岁。'),
  w('family', '家庭', '/ˈfæməli/', '👨‍👩‍👧‍👦', 'I love my family.', '我爱我的家庭。'),
], '👨‍👩‍👧‍👦')
const L1_U8 = unit('L1', 8, '更多家人', 'More Family', [
  w('son', '儿子', '/sʌn/', '👦', 'He is my son.', '他是我的儿子。'),
  w('daughter', '女儿', '/ˈdɔːtər/', '👧', 'She is my daughter.', '她是我的女儿。'),
  w('parents', '父母', '/ˈperənts/', '👨‍👩‍👧', 'I love my parents.', '我爱我的父母。'),
  w('children', '孩子们', '/ˈtʃɪldrən/', '🧒', 'The children are playing.', '孩子们在玩耍。'),
  w('twins', '双胞胎', '/twɪnz/', '👯', 'They are twins.', '他们是双胞胎。'),
  w('man', '男人', '/mæn/', '🧔', 'The man is tall.', '那个男人很高。'),
  w('woman', '女人', '/ˈwʊmən/', '👩‍🦳', 'The woman is kind.', '那个女人很和善。'),
  w('people', '人们', '/ˈpiːpl/', '👥', 'I see many people.', '我看见很多人。'),
  w('home', '家', '/hoʊm/', '🏠', 'I go home at five.', '我五点回家。'),
  w('house', '房子', '/haʊs/', '🏘️', 'My house is big.', '我家很大。'),
  w('love', '爱', '/lʌv/', '❤️', 'I love my family.', '我爱我的家人。'),
], '🏠')
const L1_U9 = unit('L1', 9, '家庭情感与外貌', 'Feelings & Looks', [
  w('hug', '拥抱', '/hʌɡ/', '🤗', 'Give mom a hug.', '给妈妈一个拥抱。'),
  w('kiss', '亲吻', '/kɪs/', '😘', 'I kiss my baby sister.', '我亲吻我的小妹妹。'),
  w('old', '年老的', '/oʊld/', '🧓', 'Grandpa is old.', '爷爷年纪大了。'),
  w('young', '年轻的', '/jʌŋ/', '🐣', 'The baby is young.', '宝宝还很小。'),
  w('tall', '高的', '/tɔːl/', '🦒', 'My brother is tall.', '我哥哥很高。'),
  w('short', '矮的', '/ʃɔːrt/', '🐛', 'My sister is short.', '我妹妹比较矮。'),
  w('big', '大的', '/bɪɡ/', '🐘', 'We have a big family.', '我们家庭很大。'),
  w('small', '小的', '/smɔːl/', '🐭', 'The baby has small hands.', '宝宝的手很小。'),
  w('together', '一起', '/təˈɡeðər/', '🤝', 'We eat together.', '我们一起吃饭。'),
  w('happy', '开心的', '/ˈhæpi/', '😀', 'My family is happy.', '我的家庭很幸福。'),
  w('kind', '善良的', '/kaɪnd/', '💛', 'My mom is kind.', '我妈妈很善良。'),
], '❤️')
const L1_U10 = unit('L1', 10, '宠物与农场动物', 'Pets & Farm Animals', [
  w('cat', '猫', '/kæt/', '🐱', 'The cat is sleeping.', '猫在睡觉。'),
  w('dog', '狗', '/dɔːɡ/', '🐶', 'My dog can run fast.', '我的狗跑得很快。'),
  w('bird', '鸟', '/bɜːrd/', '🐦', 'The bird can fly.', '鸟会飞。'),
  w('fish', '鱼', '/fɪʃ/', '🐟', 'Fish live in water.', '鱼生活在水里。'),
  w('rabbit', '兔子', '/ˈræbɪt/', '🐰', 'The rabbit jumps high.', '兔子跳得很高。'),
  w('duck', '鸭子', '/dʌk/', '🦆', 'The duck says quack.', '鸭子嘎嘎叫。'),
  w('horse', '马', '/hɔːrs/', '🐴', 'I can ride a horse.', '我会骑马。'),
  w('cow', '奶牛', '/kaʊ/', '🐄', 'The cow gives milk.', '奶牛产牛奶。'),
  w('pig', '猪', '/pɪɡ/', '🐷', 'The pig is pink.', '这只猪是粉色的。'),
  w('sheep', '绵羊', '/ʃiːp/', '🐑', 'The sheep says baa.', '羊咩咩叫。'),
  w('goat', '山羊', '/ɡoʊt/', '🐐', 'The goat eats grass.', '山羊吃草。'),
  w('chicken', '鸡', '/ˈtʃɪkɪn/', '🐔', 'The chicken lays eggs.', '鸡下蛋。'),
], '🐶')
const L1_U11 = unit('L1', 11, '野生动物', 'Wild Animals', [
  w('panda', '熊猫', '/ˈpændə/', '🐼', 'Pandas eat bamboo.', '熊猫吃竹子。'),
  w('monkey', '猴子', '/ˈmʌŋki/', '🐵', 'The monkey likes bananas.', '猴子喜欢香蕉。'),
  w('elephant', '大象', '/ˈelɪfənt/', '🐘', 'The elephant is big.', '大象很大。'),
  w('lion', '狮子', '/ˈlaɪən/', '🦁', 'The lion is strong.', '狮子很强壮。'),
  w('tiger', '老虎', '/ˈtaɪɡər/', '🐯', 'The tiger runs fast.', '老虎跑得很快。'),
  w('bear', '熊', '/ber/', '🐻', 'The bear likes honey.', '熊喜欢蜂蜜。'),
  w('frog', '青蛙', '/frɔːɡ/', '🐸', 'The frog can jump high.', '青蛙能跳得很高。'),
  w('snake', '蛇', '/sneɪk/', '🐍', 'The snake has no legs.', '蛇没有腿。'),
  w('turtle', '乌龟', '/ˈtɜːrtl/', '🐢', 'The turtle walks slowly.', '乌龟走得很慢。'),
  w('fox', '狐狸', '/fɑːks/', '🦊', 'The fox is clever.', '狐狸很聪明。'),
  w('deer', '鹿', '/dɪr/', '🦌', 'The deer runs in the forest.', '鹿在森林里奔跑。'),
], '🦁')
const L1_U12 = unit('L1', 12, '更多动物朋友', 'More Animals', [
  w('bee', '蜜蜂', '/biː/', '🐝', 'The bee makes honey.', '蜜蜂酿蜂蜜。'),
  w('butterfly', '蝴蝶', '/ˈbʌtərflaɪ/', '🦋', 'The butterfly is beautiful.', '蝴蝶很美丽。'),
  w('spider', '蜘蛛', '/ˈspaɪdər/', '🕷️', 'The spider makes a web.', '蜘蛛结网。'),
  w('mouse', '老鼠', '/maʊs/', '🐭', 'The mouse is small.', '老鼠很小。'),
  w('owl', '猫头鹰', '/aʊl/', '🦉', 'The owl sleeps in the day.', '猫头鹰白天睡觉。'),
  w('zebra', '斑马', '/ˈziːbrə/', '🦓', 'The zebra has stripes.', '斑马有条纹。'),
  w('giraffe', '长颈鹿', '/dʒəˈræf/', '🦒', 'The giraffe has a long neck.', '长颈鹿的脖子很长。'),
  w('kangaroo', '袋鼠', '/ˌkæŋɡəˈruː/', '🦘', 'The kangaroo can jump far.', '袋鼠能跳得很远。'),
  w('koala', '考拉', '/koʊˈɑːlə/', '🐨', 'The koala eats leaves.', '考拉吃树叶。'),
  w('dolphin', '海豚', '/ˈdɑːlfɪn/', '🐬', 'The dolphin swims fast.', '海豚游得很快。'),
  w('whale', '鲸鱼', '/weɪl/', '🐋', 'The whale is huge.', '鲸鱼很巨大。'),
], '🦋')
const L1_U13 = unit('L1', 13, '五官与头部', 'Head & Face', [
  w('eye', '眼睛', '/aɪ/', '👀', 'I have two eyes.', '我有两只眼睛。'),
  w('ear', '耳朵', '/ɪr/', '👂', 'Rabbits have big ears.', '兔子有大耳朵。'),
  w('nose', '鼻子', '/noʊz/', '👃', 'My nose is small.', '我的鼻子很小。'),
  w('mouth', '嘴巴', '/maʊθ/', '👄', 'Open your mouth.', '张开你的嘴巴。'),
  w('head', '头', '/hed/', '🧑', 'Touch your head.', '摸摸你的头。'),
  w('hair', '头发', '/her/', '💇', 'My hair is black.', '我的头发是黑色的。'),
  w('face', '脸', '/feɪs/', '😊', 'Wash your face.', '洗洗你的脸。'),
  w('chin', '下巴', '/tʃɪn/', '😬', 'Touch your chin.', '摸摸你的下巴。'),
  w('cheek', '脸颊', '/tʃiːk/', '😙', 'Kiss my cheek.', '亲亲我的脸颊。'),
  w('eyebrow', '眉毛', '/ˈaɪbraʊ/', '🤨', 'Raise your eyebrow.', '扬起你的眉毛。'),
  w('forehead', '额头', '/ˈfɔːrhed/', '🤕', 'Touch your forehead.', '摸摸你的额头。'),
], '👀')
const L1_U14 = unit('L1', 14, '四肢', 'Arms & Legs', [
  w('hand', '手', '/hænd/', '✋', 'Wash your hands.', '洗洗你的手。'),
  w('foot', '脚', '/fʊt/', '🦶', 'My foot hurts.', '我的脚疼。'),
  w('leg', '腿', '/leɡ/', '🦵', 'Dogs have four legs.', '狗有四条腿。'),
  w('arm', '手臂', '/ɑːrm/', '💪', 'I have two arms.', '我有两条手臂。'),
  w('finger', '手指', '/ˈfɪŋɡər/', '👆', 'Count on your fingers.', '用手指数一数。'),
  w('toe', '脚趾', '/toʊ/', '👣', 'My toe hurts.', '我的脚趾疼。'),
  w('knee', '膝盖', '/niː/', '🧎', 'I hurt my knee.', '我的膝盖受伤了。'),
  w('elbow', '手肘', '/ˈelboʊ/', '📐', 'Bend your elbow.', '弯曲你的手肘。'),
  w('wrist', '手腕', '/rɪst/', '⌚', 'I wear a watch on my wrist.', '我手腕上戴着手表。'),
  w('ankle', '脚踝', '/ˈæŋkl/', '🩰', 'I twisted my ankle.', '我扭伤了脚踝。'),
  w('nail', '指甲', '/neɪl/', '💅', 'Cut your nails.', '剪剪你的指甲。'),
], '✋')
const L1_U15 = unit('L1', 15, '身体其他部位', 'Body Parts', [
  w('teeth', '牙齿', '/tiːθ/', '🦷', 'Brush your teeth.', '刷你的牙齿。'),
  w('tongue', '舌头', '/tʌŋ/', '👅', 'Stick out your tongue.', '伸出你的舌头。'),
  w('neck', '脖子', '/nek/', '🧣', 'My neck is short.', '我的脖子很短。'),
  w('shoulder', '肩膀', '/ˈʃoʊldər/', '🤷', 'Put it on your shoulder.', '把它放在你的肩膀上。'),
  w('back', '背部', '/bæk/', '🐢', 'My back hurts a little.', '我的背有点疼。'),
  w('tummy', '肚子', '/ˈtʌmi/', '🤰', 'My tummy is full.', '我的肚子饱了。'),
  w('skin', '皮肤', '/skɪn/', '🤲', 'My skin is soft.', '我的皮肤很柔软。'),
  w('heart', '心脏', '/hɑːrt/', '❤️', 'My heart beats fast.', '我的心跳得很快。'),
  w('body', '身体', '/ˈbɑːdi/', '🧍', 'Move your body.', '动一动你的身体。'),
  w('lip', '嘴唇', '/lɪp/', '💋', 'Close your lips.', '闭上你的嘴唇。'),
  w('bone', '骨头', '/boʊn/', '🦴', 'The dog likes the bone.', '狗狗喜欢那根骨头。'),
], '🧍')
const L1_U16 = unit('L1', 16, '水果乐园', 'Fruits', [
  w('apple', '苹果', '/ˈæpl/', '🍎', 'I eat an apple.', '我吃一个苹果。'),
  w('banana', '香蕉', '/bəˈnænə/', '🍌', 'The banana is yellow.', '香蕉是黄色的。'),
  w('orange', '橙子', '/ˈɔːrɪndʒ/', '🍊', 'I eat an orange.', '我吃一个橙子。'),
  w('grape', '葡萄', '/ɡreɪp/', '🍇', 'The grapes are sweet.', '葡萄很甜。'),
  w('strawberry', '草莓', '/ˈstrɔːberi/', '🍓', 'I like strawberries.', '我喜欢草莓。'),
  w('watermelon', '西瓜', '/ˈwɔːtərmelən/', '🍉', 'Watermelon is juicy.', '西瓜多汁。'),
  w('mango', '芒果', '/ˈmæŋɡoʊ/', '🥭', 'The mango is yellow.', '芒果是黄色的。'),
  w('pineapple', '菠萝', '/ˈpaɪnæpl/', '🍍', 'I like pineapple juice.', '我喜欢菠萝汁。'),
  w('tomato', '西红柿', '/təˈmeɪtoʊ/', '🍅', 'The tomato is red.', '西红柿是红色的。'),
], '🍎')
const L1_U17 = unit('L1', 17, '主食与饮品', 'Staples & Drinks', [
  w('bread', '面包', '/bred/', '🍞', 'I like bread for breakfast.', '我早餐喜欢吃面包。'),
  w('milk', '牛奶', '/mɪlk/', '🥛', 'I drink milk every day.', '我每天喝牛奶。'),
  w('egg', '鸡蛋', '/eɡ/', '🥚', 'I have an egg.', '我有一个鸡蛋。'),
  w('rice', '米饭', '/raɪs/', '🍚', 'We eat rice for lunch.', '我们午餐吃米饭。'),
  w('water', '水', '/ˈwɔːtər/', '💧', 'I need some water.', '我需要一些水。'),
  w('juice', '果汁', '/dʒuːs/', '🧃', 'I drink apple juice.', '我喝苹果汁。'),
  w('tea', '茶', '/tiː/', '🍵', 'Grandpa drinks tea.', '爷爷喝茶。'),
  w('noodles', '面条', '/ˈnuːdlz/', '🍜', 'I eat noodles for lunch.', '我午餐吃面条。'),
  w('soup', '汤', '/suːp/', '🍲', 'The soup is hot.', '汤很热。'),
  w('cheese', '奶酪', '/tʃiːz/', '🧀', 'I like cheese on bread.', '我喜欢面包上放奶酪。'),
  w('butter', '黄油', '/ˈbʌtər/', '🧈', 'Spread butter on the bread.', '在面包上涂黄油。'),
  w('jam', '果酱', '/dʒæm/', '🫙', 'I like jam on toast.', '我喜欢吐司抹果酱。'),
], '🍞')
const L1_U18 = unit('L1', 18, '甜品与蔬菜', 'Sweets & Veggies', [
  w('cake', '蛋糕', '/keɪk/', '🍰', 'It is my birthday cake.', '这是我的生日蛋糕。'),
  w('cookie', '饼干', '/ˈkʊki/', '🍪', 'Mom bakes cookies.', '妈妈烤饼干。'),
  w('candy', '糖果', '/ˈkændi/', '🍬', 'I have a candy.', '我有一颗糖果。'),
  w('chocolate', '巧克力', '/ˈtʃɔːklət/', '🍫', 'I love chocolate.', '我爱巧克力。'),
  w('ice cream', '冰淇淋', '/aɪs kriːm/', '🍦', 'Ice cream is cold.', '冰淇淋很冰。'),
  w('honey', '蜂蜜', '/ˈhʌni/', '🍯', 'Bees make honey.', '蜜蜂酿蜂蜜。'),
  w('pizza', '披萨', '/ˈpiːtsə/', '🍕', 'I love pizza.', '我爱披萨。'),
  w('sandwich', '三明治', '/ˈsænwɪdʒ/', '🥪', 'I eat a sandwich.', '我吃一个三明治。'),
  w('meat', '肉', '/miːt/', '🍖', 'We eat meat sometimes.', '我们有时吃肉。'),
  w('vegetable', '蔬菜', '/ˈvedʒtəbl/', '🥦', 'Eat your vegetables.', '吃你的蔬菜。'),
  w('carrot', '胡萝卜', '/ˈkærət/', '🥕', 'Rabbits like carrots.', '兔子喜欢胡萝卜。'),
  w('potato', '土豆', '/pəˈteɪtoʊ/', '🥔', 'I like potato soup.', '我喜欢土豆汤。'),
], '🍰')
const L1_U19 = unit('L1', 19, '文具', 'School Supplies', [
  w('pen', '钢笔', '/pen/', '🖊️', 'This is my pen.', '这是我的钢笔。'),
  w('pencil', '铅笔', '/ˈpensl/', '✏️', 'I write with a pencil.', '我用铅笔写字。'),
  w('eraser', '橡皮擦', '/ɪˈreɪsər/', '🧽', 'I use an eraser.', '我用橡皮擦。'),
  w('sharpener', '卷笔刀', '/ˈʃɑːrpənər/', '⚙️', 'Sharpen your pencil.', '削尖你的铅笔。'),
  w('scissors', '剪刀', '/ˈsɪzərz/', '✂️', 'Cut the paper with scissors.', '用剪刀剪纸。'),
  w('glue', '胶水', '/ɡluː/', '🧴', 'Use glue to stick paper.', '用胶水粘纸。'),
  w('notebook', '笔记本', '/ˈnoʊtbʊk/', '📓', 'I write in my notebook.', '我在笔记本上写字。'),
  w('ruler', '尺子', '/ˈruːlər/', '📏', 'Use a ruler to draw a line.', '用尺子画一条线。'),
  w('chalk', '粉笔', '/tʃɔːk/', '⬜', 'The teacher writes with chalk.', '老师用粉笔写字。'),
  w('crayon', '蜡笔', '/ˈkreɪɑːn/', '🖍️', 'I draw with crayons.', '我用蜡笔画画。'),
  w('paint', '颜料', '/peɪnt/', '🎨', 'I paint a picture.', '我画一幅画。'),
  w('brush', '画笔', '/brʌʃ/', '🖌️', 'Use a brush to paint.', '用画笔画画。'),
], '✏️')
const L1_U20 = unit('L1', 20, '玩具', 'Toys', [
  w('ball', '球', '/bɔːl/', '⚽', 'Let\'s play with the ball.', '我们一起玩球吧。'),
  w('kite', '风筝', '/kaɪt/', '🪁', 'We fly a kite.', '我们放风筝。'),
  w('balloon', '气球', '/bəˈluːn/', '🎈', 'I have a red balloon.', '我有一个红气球。'),
  w('doll', '玩偶', '/dɑːl/', '🪆', 'I play with my doll.', '我和我的娃娃玩。'),
  w('robot', '机器人', '/ˈroʊbɑːt/', '🤖', 'The robot can walk.', '机器人会走路。'),
  w('blocks', '积木', '/blɑːks/', '🧱', 'I build with blocks.', '我用积木搭建。'),
  w('puzzle', '拼图', '/ˈpʌzl/', '🧩', 'I like puzzles.', '我喜欢拼图。'),
  w('teddy bear', '泰迪熊', '/ˈtedi ber/', '🧸', 'I sleep with my teddy bear.', '我抱着泰迪熊睡觉。'),
  w('marble', '弹珠', '/ˈmɑːrbl/', '🔮', 'I play marbles.', '我玩弹珠。'),
  w('yo-yo', '溜溜球', '/ˈjoʊjoʊ/', '🪀', 'I can play with a yo-yo.', '我会玩溜溜球。'),
  w('sticker', '贴纸', '/ˈstɪkər/', '🏷️', 'I like colorful stickers.', '我喜欢彩色贴纸。'),
], '🧸')
const L1_U21 = unit('L1', 21, '教室物品', 'Classroom Items', [
  w('book', '书', '/bʊk/', '📖', 'I read a book.', '我在读一本书。'),
  w('bag', '包', '/bæɡ/', '🎒', 'My bag is heavy.', '我的书包很重。'),
  w('desk', '书桌', '/desk/', '🗄️', 'Sit at your desk.', '坐在你的桌子旁。'),
  w('chair', '椅子', '/tʃer/', '🪑', 'Sit on the chair.', '坐在椅子上。'),
  w('computer', '电脑', '/kəmˈpjuːtər/', '💻', 'I use a computer.', '我使用电脑。'),
  w('tablet', '平板电脑', '/ˈtæblət/', '📱', 'I watch videos on a tablet.', '我用平板看视频。'),
  w('box', '盒子', '/bɑːks/', '📦', 'Put the toys in the box.', '把玩具放进盒子里。'),
  w('clock', '钟', '/klɑːk/', '🕒', 'The clock is on the wall.', '钟在墙上。'),
  w('drum', '鼓', '/drʌm/', '🥁', 'He plays the drum.', '他打鼓。'),
  w('guitar', '吉他', '/ɡɪˈtɑːr/', '🎸', 'She plays the guitar.', '她弹吉他。'),
  w('whistle', '哨子', '/ˈwɪsl/', '📯', 'The teacher blows the whistle.', '老师吹哨子。'),
], '🎒')
const L1_U22 = unit('L1', 22, '天气变化', 'Weather', [
  w('sunny', '晴天', '/ˈsʌni/', '☀️', 'It is sunny today.', '今天是晴天。'),
  w('rainy', '雨天', '/ˈreɪni/', '🌧️', 'It is rainy outside.', '外面在下雨。'),
  w('cloudy', '多云', '/ˈklaʊdi/', '☁️', 'It is cloudy today.', '今天多云。'),
  w('snowy', '下雪', '/ˈsnoʊi/', '❄️', 'It is snowy in winter.', '冬天下雪。'),
  w('windy', '刮风的', '/ˈwɪndi/', '💨', 'It is windy today.', '今天刮风。'),
  w('foggy', '有雾的', '/ˈfɑːɡi/', '🌫️', 'It is foggy this morning.', '今天早上有雾。'),
  w('stormy', '有暴风雨的', '/ˈstɔːrmi/', '⛈️', 'It is stormy outside.', '外面在暴风雨。'),
  w('hot', '热的', '/hɑːt/', '🥵', 'It is hot in summer.', '夏天很热。'),
  w('cold', '冷的', '/koʊld/', '🥶', 'It is cold in winter.', '冬天很冷。'),
  w('warm', '温暖的', '/wɔːrm/', '🌡️', 'The soup is warm.', '汤是温热的。'),
  w('cool', '凉爽的', '/kuːl/', '🍃', 'The weather is cool today.', '今天天气凉爽。'),
  w('rainbow', '彩虹', '/ˈreɪnboʊ/', '🌈', 'I see a rainbow.', '我看见一道彩虹。'),
], '⛅')
const L1_U23 = unit('L1', 23, '上衣与配饰', 'Tops & Accessories', [
  w('hat', '帽子', '/hæt/', '🧢', 'I wear a hat.', '我戴帽子。'),
  w('shoes', '鞋子', '/ʃuːz/', '👟', 'My shoes are new.', '我的鞋子是新的。'),
  w('shirt', '衬衫', '/ʃɜːrt/', '👔', 'He wears a blue shirt.', '他穿一件蓝色衬衫。'),
  w('coat', '外套', '/koʊt/', '🧥', 'Put on your coat.', '穿上你的外套。'),
  w('sweater', '毛衣', '/ˈswetər/', '🎽', 'Put on your sweater.', '穿上你的毛衣。'),
  w('jacket', '夹克', '/ˈdʒækɪt/', '🥋', 'He wears a jacket.', '他穿着夹克。'),
  w('T-shirt', 'T恤', '/ˈtiː ʃɜːrt/', '👕', 'I like my blue T-shirt.', '我喜欢我的蓝色T恤。'),
  w('scarf', '围巾', '/skɑːrf/', '🧣', 'I wear a scarf.', '我戴围巾。'),
  w('gloves', '手套', '/ɡlʌvz/', '🧤', 'Wear gloves in winter.', '冬天戴手套。'),
  w('belt', '腰带', '/belt/', '🎗️', 'He wears a black belt.', '他系着黑色腰带。'),
  w('umbrella', '雨伞', '/ʌmˈbrelə/', '☂️', 'Take your umbrella.', '带上你的伞。'),
], '🧥')
const L1_U24 = unit('L1', 24, '下装与其他', 'Bottoms & More', [
  w('pants', '裤子', '/pænts/', '👖', 'I wear blue pants.', '我穿蓝色的裤子。'),
  w('skirt', '短裙', '/skɜːrt/', '🎀', 'Her skirt is pink.', '她的裙子是粉色的。'),
  w('dress', '连衣裙', '/dres/', '👗', 'She wears a nice dress.', '她穿着一条漂亮的裙子。'),
  w('socks', '袜子', '/sɑːks/', '🧦', 'Put on your socks.', '穿上你的袜子。'),
  w('boots', '靴子', '/buːts/', '👢', 'I wear boots in rain.', '下雨天我穿靴子。'),
  w('jeans', '牛仔裤', '/dʒiːnz/', '🧵', 'He wears jeans.', '他穿牛仔裤。'),
  w('shorts', '短裤', '/ʃɔːrts/', '🩳', 'I wear shorts in summer.', '夏天我穿短裤。'),
  w('sunglasses', '太阳镜', '/ˈsʌnɡlæsɪz/', '🕶️', 'Wear sunglasses on sunny days.', '晴天戴太阳镜。'),
  w('button', '纽扣', '/ˈbʌtn/', '🔘', 'Button up your coat.', '扣好你的外套。'),
  w('zipper', '拉链', '/ˈzɪpər/', '🤐', 'Zip up your jacket.', '拉上你的夹克拉链。'),
], '👖')
const L1_U25 = unit('L1', 25, '运动动作', 'Move Actions', [
  w('run', '跑', '/rʌn/', '🏃', 'I can run fast.', '我能跑得很快。'),
  w('jump', '跳', '/dʒʌmp/', '🤸', 'The frog can jump.', '青蛙会跳。'),
  w('walk', '走路', '/wɔːk/', '🚶', 'I walk to school.', '我走路去上学。'),
  w('climb', '爬', '/klaɪm/', '🧗', 'The cat can climb trees.', '猫会爬树。'),
  w('dance', '跳舞', '/dæns/', '💃', 'She likes to dance.', '她喜欢跳舞。'),
  w('skip', '跳绳', '/skɪp/', '🕺', 'The girl can skip rope.', '这个女孩会跳绳。'),
  w('swim', '游泳', '/swɪm/', '🏊', 'We swim in summer.', '我们夏天游泳。'),
  w('ride', '骑', '/raɪd/', '🚲', 'I ride my bike.', '我骑自行车。'),
  w('fly', '飞', '/flaɪ/', '✈️', 'Birds can fly.', '鸟会飞。'),
  w('stand', '站立', '/stænd/', '🧍', 'Stand up, please.', '请站起来。'),
  w('sit', '坐', '/sɪt/', '🪑', 'Sit down, please.', '请坐下。'),
], '🏃')
const L1_U26 = unit('L1', 26, '生活动作', 'Daily Actions', [
  w('eat', '吃', '/iːt/', '🍽️', 'Let\'s eat lunch.', '我们吃午饭吧。'),
  w('drink', '喝', '/drɪŋk/', '🥤', 'I drink juice.', '我喝果汁。'),
  w('read', '读', '/riːd/', '📚', 'I read every night.', '我每晚都读书。'),
  w('write', '写字', '/raɪt/', '✍️', 'I write my name.', '我写我的名字。'),
  w('play', '玩', '/pleɪ/', '🎮', 'Let\'s play together.', '我们一起玩吧。'),
  w('watch', '看', '/wɑːtʃ/', '👀', 'I watch TV at night.', '我晚上看电视。'),
  w('listen', '听', '/ˈlɪsn/', '👂', 'Listen to the teacher.', '听老师讲话。'),
  w('talk', '说话', '/tɔːk/', '🗣️', 'We talk on the phone.', '我们打电话聊天。'),
  w('wash', '洗', '/wɑːʃ/', '🧼', 'Wash your hands.', '洗你的手。'),
  w('cook', '做饭', '/kʊk/', '👩‍🍳', 'Mom likes to cook.', '妈妈喜欢做饭。'),
  w('help', '帮助', '/help/', '🤝', 'I help my mom.', '我帮助我妈妈。'),
], '🍽️')
const L1_U27 = unit('L1', 27, '表情与其他动作（复习）', 'Expressions & More', [
  w('sing', '唱歌', '/sɪŋ/', '🎤', 'She likes to sing.', '她喜欢唱歌。'),
  w('sleep', '睡觉', '/sliːp/', '😴', 'The baby is asleep.', '宝宝睡着了。'),
  w('draw', '画画', '/drɔː/', '✏️', 'I draw a cat.', '我画一只猫。'),
  w('laugh', '大笑', '/læf/', '😂', 'The baby likes to laugh.', '宝宝喜欢笑。'),
  w('cry', '哭', '/kraɪ/', '😢', 'The baby will cry.', '宝宝会哭。'),
  w('smile', '微笑', '/smaɪl/', '😊', 'Please smile for the photo.', '请对着照片微笑。'),
  w('wave', '挥手', '/weɪv/', '👋', 'Wave to your friend.', '向你的朋友挥手。'),
  w('open', '打开', '/ˈoʊpən/', '🔓', 'Open the door, please.', '请打开门。'),
  w('close', '关闭', '/kloʊz/', '🔒', 'Close the window.', '关上窗户。'),
  w('catch', '接住', '/kætʃ/', '🧤', 'Catch the ball!', '接住球！'),
  w('throw', '扔', '/θroʊ/', '🤾', 'Throw the ball to me.', '把球扔给我。'),
  w('kick', '踢', '/kɪk/', '⚽', 'I kick the ball.', '我踢球。'),
], '😊')

// ---------------- Level 2 (YLE Movers, ~600 词，每单元约 12 词，已填充 24 单元 / 288 词) ----------------
const L2_U1 = unit('L2', 1, '教室日常', 'Classroom', [
  w('teacher', '老师', '/ˈtiːtʃər/', '🧑‍🏫', 'My teacher is kind.', '我的老师很友善。'),
  w('student', '学生', '/ˈstuːdnt/', '🧑‍🎓', 'I am a student.', '我是一名学生。'),
  w('classroom', '教室', '/ˈklæsruːm/', '🏫', 'We are in the classroom.', '我们在教室里。'),
  w('blackboard', '黑板', '/ˈblækbɔːrd/', '⬛', 'Look at the blackboard.', '看黑板。'),
  w('chair', '椅子', '/tʃer/', '🪑', 'Sit on your chair.', '坐在你的椅子上。'),
  w('window', '窗户', '/ˈwɪndoʊ/', '🪟', 'Open the window, please.', '请打开窗户。'),
  w('door', '门', '/dɔːr/', '🚪', 'Close the door.', '关上门。'),
  w('pencil', '铅笔', '/ˈpensl/', '✏️', 'I write with a pencil.', '我用铅笔写字。'),
  w('eraser', '橡皮擦', '/ɪˈreɪsər/', '🧽', 'May I use your eraser?', '我可以用你的橡皮擦吗？'),
  w('ruler', '尺子', '/ˈruːlər/', '📏', 'Draw a line with a ruler.', '用尺子画一条线。'),
  w('bag', '书包', '/bæɡ/', '🎒', 'My bag is on the desk.', '我的书包在桌子上。'),
  w('map', '地图', '/mæp/', '🗺️', 'There is a map on the wall.', '墙上有一张地图。'),
], '🏫')
const L2_U2 = unit('L2', 2, '一天的时间', 'Daily Routine', [
  w('get up', '起床', '/ɡet ʌp/', '🌅', 'I get up at seven.', '我七点起床。'),
  w('brush teeth', '刷牙', '/brʌʃ tiːθ/', '🪥', 'I brush my teeth.', '我刷牙。'),
  w('wash face', '洗脸', '/wɑːʃ feɪs/', '🧼', 'I wash my face.', '我洗脸。'),
  w('breakfast', '早餐', '/ˈbrekfəst/', '🍳', 'I eat breakfast at home.', '我在家吃早餐。'),
  w('lunch', '午餐', '/lʌntʃ/', '🍱', 'We have lunch at school.', '我们在学校吃午餐。'),
  w('homework', '作业', '/ˈhoʊmwɜːrk/', '📝', 'I do my homework.', '我做作业。'),
  w('bath', '洗澡', '/bæθ/', '🛁', 'I take a bath at night.', '我晚上洗澡。'),
  w('bed', '床', '/bed/', '🛏️', 'I go to bed at nine.', '我九点上床睡觉。'),
  w('dinner', '晚餐', '/ˈdɪnər/', '🍽️', 'We have dinner together.', '我们一起吃晚餐。'),
  w('go to school', '去上学', '/ɡoʊ tuː skuːl/', '🏫', 'I go to school by bus.', '我坐公交车去上学。'),
  w('come home', '回家', '/kʌm hoʊm/', '🏠', 'I come home at four.', '我四点回家。'),
  w('watch TV', '看电视', '/wɑːtʃ ˌtiːˈviː/', '📺', 'I watch TV in the evening.', '我晚上看电视。'),
], '⏰')
const L2_U3 = unit('L2', 3, '运动乐园', 'Sports', [
  w('football', '足球', '/ˈfʊtbɔːl/', '⚽', 'I play football.', '我踢足球。'),
  w('basketball', '篮球', '/ˈbæskɪtbɔːl/', '🏀', 'He plays basketball well.', '他篮球打得很好。'),
  w('swimming', '游泳', '/ˈswɪmɪŋ/', '🏊', 'Swimming is fun.', '游泳很有趣。'),
  w('jump rope', '跳绳', '/dʒʌmp roʊp/', '🪢', 'She can jump rope.', '她会跳绳。'),
  w('badminton', '羽毛球', '/ˈbædmɪntən/', '🏸', 'We play badminton together.', '我们一起打羽毛球。'),
  w('table tennis', '乒乓球', '/ˈteɪbl ˈtenɪs/', '🏓', 'Table tennis is popular in China.', '乒乓球在中国很受欢迎。'),
  w('skate', '滑冰', '/skeɪt/', '⛸️', 'I like to skate.', '我喜欢滑冰。'),
  w('bike', '自行车', '/baɪk/', '🚲', 'I ride my bike to school.', '我骑自行车上学。'),
  w('volleyball', '排球', '/ˈvɑːlibɔːl/', '🏐', 'We play volleyball at school.', '我们在学校打排球。'),
  w('tennis', '网球', '/ˈtenɪs/', '🎾', 'My sister plays tennis.', '我姐姐打网球。'),
  w('run', '跑步', '/rʌn/', '🏃', 'I run every morning.', '我每天早上跑步。'),
  w('baseball', '棒球', '/ˈbeɪsbɔːl/', '⚾', 'He likes playing baseball.', '他喜欢打棒球。'),
], '⚽')
const L2_U4 = unit('L2', 4, '交通工具', 'Transport', [
  w('car', '汽车', '/kɑːr/', '🚗', 'We go by car.', '我们坐汽车去。'),
  w('bus', '公交车', '/bʌs/', '🚌', 'I take the bus to school.', '我坐公交车上学。'),
  w('train', '火车', '/treɪn/', '🚆', 'The train is fast.', '火车很快。'),
  w('plane', '飞机', '/pleɪn/', '✈️', 'We fly by plane.', '我们坐飞机去。'),
  w('ship', '轮船', '/ʃɪp/', '🚢', 'The ship is big.', '这艘船很大。'),
  w('taxi', '出租车', '/ˈtæksi/', '🚕', 'Let\'s take a taxi.', '我们打车吧。'),
  w('subway', '地铁', '/ˈsʌbweɪ/', '🚇', 'The subway is quick.', '地铁很快。'),
  w('motorbike', '摩托车', '/ˈmoʊtərbaɪk/', '🏍️', 'He rides a motorbike.', '他骑摩托车。'),
  w('boat', '小船', '/boʊt/', '⛵', 'We sail a boat on the lake.', '我们在湖上划船。'),
  w('truck', '卡车', '/trʌk/', '🚚', 'The truck carries fruit.', '卡车运送水果。'),
  w('helicopter', '直升机', '/ˈhelɪkɑːptər/', '🚁', 'The helicopter flies high.', '直升机飞得很高。'),
  w('tram', '有轨电车', '/træm/', '🚋', 'We take the tram downtown.', '我们坐有轨电车去市中心。'),
], '🚗')
const L2_U5 = unit('L2', 5, '职业角色', 'Jobs', [
  w('doctor', '医生', '/ˈdɑːktər/', '🧑‍⚕️', 'The doctor helps people.', '医生帮助人们。'),
  w('nurse', '护士', '/nɜːrs/', '👩‍⚕️', 'The nurse is friendly.', '护士很友善。'),
  w('police officer', '警察', '/pəˈliːs ˈɔːfɪsər/', '👮', 'The police officer helps us.', '警察帮助我们。'),
  w('firefighter', '消防员', '/ˈfaɪərfaɪtər/', '🧑‍🚒', 'Firefighters are brave.', '消防员很勇敢。'),
  w('farmer', '农民', '/ˈfɑːrmər/', '🧑‍🌾', 'The farmer grows rice.', '农民种水稻。'),
  w('cook', '厨师', '/kʊk/', '🧑‍🍳', 'The cook makes noodles.', '厨师做面条。'),
  w('pilot', '飞行员', '/ˈpaɪlət/', '🧑‍✈️', 'The pilot flies a plane.', '飞行员开飞机。'),
  w('singer', '歌手', '/ˈsɪŋər/', '🧑‍🎤', 'She is a great singer.', '她是一位很棒的歌手。'),
  w('dancer', '舞蹈家', '/ˈdænsər/', '💃', 'The dancer moves gracefully.', '舞蹈家动作很优美。'),
  w('artist', '艺术家', '/ˈɑːrtɪst/', '🧑‍🎨', 'The artist paints pictures.', '艺术家画画。'),
  w('driver', '司机', '/ˈdraɪvər/', '🚌', 'The driver drives the bus.', '司机开公交车。'),
  w('vet', '兽医', '/vet/', '🐾', 'The vet takes care of my dog.', '兽医照顾我的狗。'),
], '👩‍⚕️')
const L2_U6 = unit('L2', 6, '房间与家具', 'Rooms & Furniture', [
  w('bedroom', '卧室', '/ˈbedruːm/', '🛏️', 'My bedroom is small.', '我的卧室很小。'),
  w('kitchen', '厨房', '/ˈkɪtʃɪn/', '🍳', 'Mom cooks in the kitchen.', '妈妈在厨房做饭。'),
  w('bathroom', '浴室', '/ˈbæθruːm/', '🚿', 'I brush teeth in the bathroom.', '我在浴室刷牙。'),
  w('living room', '客厅', '/ˈlɪvɪŋ ruːm/', '🛋️', 'We watch TV in the living room.', '我们在客厅看电视。'),
  w('table', '桌子', '/ˈteɪbl/', '🍽️', 'Put the plate on the table.', '把盘子放在桌子上。'),
  w('chair', '椅子', '/tʃer/', '🪑', 'The chair is comfortable.', '这把椅子很舒服。'),
  w('lamp', '台灯', '/læmp/', '💡', 'Turn on the lamp.', '打开台灯。'),
  w('TV', '电视', '/ˌtiːˈviː/', '📺', 'I watch TV after dinner.', '晚饭后我看电视。'),
  w('sofa', '沙发', '/ˈsoʊfə/', '💺', 'I sit on the sofa.', '我坐在沙发上。'),
  w('wardrobe', '衣柜', '/ˈwɔːrdroʊb/', '🚪', 'My clothes are in the wardrobe.', '我的衣服在衣柜里。'),
  w('mirror', '镜子', '/ˈmɪrər/', '🪞', 'Look in the mirror.', '照照镜子。'),
  w('fridge', '冰箱', '/frɪdʒ/', '🧊', 'The milk is in the fridge.', '牛奶在冰箱里。'),
], '🛋️')
const L2_U7 = unit('L2', 7, '走进大自然', 'Nature', [
  w('tree', '树', '/triː/', '🌳', 'The tree is tall.', '这棵树很高。'),
  w('flower', '花', '/ˈflaʊər/', '🌸', 'The flower smells nice.', '这朵花很香。'),
  w('mountain', '山', '/ˈmaʊntn/', '⛰️', 'We climb the mountain.', '我们爬山。'),
  w('river', '河流', '/ˈrɪvər/', '💧', 'Fish swim in the river.', '鱼在河里游。'),
  w('moon', '月亮', '/muːn/', '🌙', 'The moon is bright.', '月亮很亮。'),
  w('star', '星星', '/stɑːr/', '⭐', 'I see many stars.', '我看见很多星星。'),
  w('sky', '天空', '/skaɪ/', '🌌', 'The sky is blue.', '天空是蓝色的。'),
  w('grass', '草', '/ɡræs/', '🌱', 'The grass is green.', '草是绿色的。'),
  w('sun', '太阳', '/sʌn/', '☀️', 'The sun is shining.', '阳光正明媚。'),
  w('lake', '湖泊', '/leɪk/', '🏞️', 'We swim in the lake.', '我们在湖里游泳。'),
  w('forest', '森林', '/ˈfɔːrɪst/', '🌲', 'Many animals live in the forest.', '很多动物生活在森林里。'),
  w('sea', '大海', '/siː/', '🌊', 'We play by the sea.', '我们在海边玩。'),
], '🌳')
const L2_U8 = unit('L2', 8, '节日与庆祝', 'Festivals', [
  w('birthday', '生日', '/ˈbɜːrθdeɪ/', '🎂', 'Happy birthday to you!', '祝你生日快乐！'),
  w('Christmas', '圣诞节', '/ˈkrɪsməs/', '🎄', 'We like Christmas.', '我们喜欢圣诞节。'),
  w('New Year', '新年', '/nuː jɪr/', '🎊', 'Happy New Year!', '新年快乐！'),
  w('party', '聚会', '/ˈpɑːrti/', '🎉', 'We have a party today.', '我们今天有聚会。'),
  w('gift', '礼物', '/ɡɪft/', '🎁', 'I got a nice gift.', '我收到一份漂亮的礼物。'),
  w('balloon', '气球', '/bəˈluːn/', '🎈', 'There are many balloons.', '有很多气球。'),
  w('candle', '蜡烛', '/ˈkændl/', '🕯️', 'Blow out the candles.', '吹灭蜡烛。'),
  w('cake', '蛋糕', '/keɪk/', '🍰', 'Let\'s cut the cake.', '我们来切蛋糕吧。'),
  w('lantern', '灯笼', '/ˈlæntərn/', '🏮', 'We hang red lanterns.', '我们挂上红灯笼。'),
  w('firework', '烟花', '/ˈfaɪərwɜːrk/', '🎆', 'We watch fireworks at night.', '我们晚上看烟花。'),
  w('card', '贺卡', '/kɑːrd/', '💌', 'I made a card for you.', '我为你做了一张贺卡。'),
  w('celebrate', '庆祝', '/ˈselɪbreɪt/', '🥳', 'Let\'s celebrate together!', '我们一起庆祝吧！'),
], '🎉')
const L2_U9 = unit('L2', 9, '情绪表达（复习）', 'Feelings', [
  w('happy', '开心', '/ˈhæpi/', '😀', 'I am happy today.', '我今天很开心。'),
  w('sad', '难过', '/sæd/', '😢', 'She feels sad.', '她感到难过。'),
  w('angry', '生气', '/ˈæŋɡri/', '😠', 'Don\'t be angry.', '别生气。'),
  w('scared', '害怕', '/skerd/', '😱', 'I am scared of the dark.', '我怕黑。'),
  w('tired', '累', '/ˈtaɪərd/', '😴', 'I am tired now.', '我现在很累。'),
  w('excited', '兴奋', '/ɪkˈsaɪtɪd/', '🤩', 'We are excited about the trip.', '我们对这次旅行很兴奋。'),
  w('shy', '害羞', '/ʃaɪ/', '😳', 'The little boy is shy.', '小男孩很害羞。'),
  w('surprised', '惊讶', '/sərˈpraɪzd/', '😮', 'I am surprised!', '我很惊讶！'),
  w('worried', '担心', '/ˈwɜːrid/', '😟', 'Mom is worried about me.', '妈妈担心我。'),
  w('bored', '无聊', '/bɔːrd/', '😑', 'I am bored at home.', '我在家很无聊。'),
  w('proud', '骄傲', '/praʊd/', '😌', 'I am proud of you.', '我为你骄傲。'),
  w('nervous', '紧张', '/ˈnɜːrvəs/', '😬', 'She feels nervous before the test.', '考试前她感到紧张。'),
], '😊')

const L2_U10 = unit('L2', 10, '城镇场所', 'Places in Town', [
  w('shop', '商店', '/ʃɑːp/', '🏪', 'I buy candy at the shop.', '我在商店买糖果。'),
  w('bank', '银行', '/bæŋk/', '🏦', 'Dad goes to the bank.', '爸爸去银行。'),
  w('hospital', '医院', '/ˈhɑːspɪtl/', '🏥', 'The hospital is near my house.', '医院在我家附近。'),
  w('station', '车站', '/ˈsteɪʃn/', '🚉', 'We wait at the station.', '我们在车站等。'),
  w('park', '公园', '/pɑːrk/', '🏞️', 'We play in the park.', '我们在公园玩。'),
  w('zoo', '动物园', '/zuː/', '🦁', 'I see lions at the zoo.', '我在动物园看到狮子。'),
  w('farm', '农场', '/fɑːrm/', '🚜', 'There are cows on the farm.', '农场里有奶牛。'),
  w('market', '市场', '/ˈmɑːrkɪt/', '🧺', 'Mom buys fish at the market.', '妈妈在市场买鱼。'),
  w('library', '图书馆', '/ˈlaɪbreri/', '📚', 'I read books in the library.', '我在图书馆看书。'),
  w('museum', '博物馆', '/mjuˈziːəm/', '🏛️', 'We visit the museum on Sunday.', '我们周日参观博物馆。'),
  w('restaurant', '餐厅', '/ˈrestərɑːnt/', '🍴', 'We eat at a restaurant.', '我们在餐厅吃饭。'),
  w('cinema', '电影院', '/ˈsɪnəmə/', '🎬', 'Let\'s go to the cinema.', '我们去电影院吧。'),
], '🏙️')
const L2_U11 = unit('L2', 11, '方位与方向', 'Directions', [
  w('left', '左边', '/left/', '⬅️', 'Turn left at the corner.', '在拐角处左转。'),
  w('right', '右边', '/raɪt/', '➡️', 'Turn right, please.', '请右转。'),
  w('straight', '直走', '/streɪt/', '⬆️', 'Go straight ahead.', '一直往前走。'),
  w('turn', '转弯', '/tɜːrn/', '🔄', 'Turn at the bank.', '在银行处转弯。'),
  w('corner', '拐角', '/ˈkɔːrnər/', '📐', 'The shop is on the corner.', '商店在拐角处。'),
  w('in front of', '在前面', '/ɪn frʌnt ʌv/', '👀', 'The car is in front of the house.', '车在房子前面。'),
  w('behind', '在后面', '/bɪˈhaɪnd/', '🙈', 'The cat hides behind the door.', '猫躲在门后。'),
  w('between', '在中间', '/bɪˈtwiːn/', '↔️', 'I sit between mom and dad.', '我坐在爸爸妈妈中间。'),
  w('next to', '在旁边', '/nekst tuː/', '👫', 'The park is next to the school.', '公园在学校旁边。'),
  w('near', '靠近', '/nɪr/', '📍', 'My house is near the park.', '我家离公园很近。'),
  w('far', '遥远', '/fɑːr/', '🛣️', 'The zoo is far from here.', '动物园离这里很远。'),
  w('opposite', '对面', '/ˈɑːpəzɪt/', '🔀', 'The bank is opposite the shop.', '银行在商店对面。'),
], '🧭')
const L2_U12 = unit('L2', 12, '星期几', 'Days of the Week', [
  w('Monday', '星期一', '/ˈmʌndeɪ/', '1️⃣', 'I go to school on Monday.', '我星期一去上学。'),
  w('Tuesday', '星期二', '/ˈtuːzdeɪ/', '2️⃣', 'We have art on Tuesday.', '我们星期二上美术课。'),
  w('Wednesday', '星期三', '/ˈwenzdeɪ/', '3️⃣', 'I swim on Wednesday.', '我星期三游泳。'),
  w('Thursday', '星期四', '/ˈθɜːrzdeɪ/', '4️⃣', 'We have music on Thursday.', '我们星期四上音乐课。'),
  w('Friday', '星期五', '/ˈfraɪdeɪ/', '5️⃣', 'I like Friday best.', '我最喜欢星期五。'),
  w('Saturday', '星期六', '/ˈsætərdeɪ/', '6️⃣', 'We play games on Saturday.', '我们星期六玩游戏。'),
  w('Sunday', '星期天', '/ˈsʌndeɪ/', '7️⃣', 'We visit grandma on Sunday.', '我们星期天去看奶奶。'),
  w('today', '今天', '/təˈdeɪ/', '📆', 'What day is it today?', '今天星期几？'),
  w('tomorrow', '明天', '/təˈmɔːroʊ/', '🌄', 'See you tomorrow.', '明天见。'),
  w('yesterday', '昨天', '/ˈjestərdeɪ/', '🌇', 'I was happy yesterday.', '我昨天很开心。'),
  w('weekend', '周末', '/ˈwiːkend/', '🎉', 'I love the weekend.', '我喜欢周末。'),
  w('week', '星期/周', '/wiːk/', '🗓️', 'There are seven days in a week.', '一周有七天。'),
], '📅')
const L2_U13 = unit('L2', 13, '月份', 'Months', [
  w('January', '一月', '/ˈdʒænjueri/', '❄️', 'January is cold.', '一月很冷。'),
  w('February', '二月', '/ˈfebrueri/', '💝', 'My birthday is in February.', '我的生日在二月。'),
  w('March', '三月', '/mɑːrtʃ/', '🌷', 'Flowers grow in March.', '三月里花儿开放。'),
  w('April', '四月', '/ˈeɪprəl/', '🌧️', 'It often rains in April.', '四月常常下雨。'),
  w('May', '五月', '/meɪ/', '🌼', 'May is warm.', '五月很暖和。'),
  w('June', '六月', '/dʒuːn/', '☀️', 'Summer starts in June.', '六月夏天开始。'),
  w('July', '七月', '/dʒuˈlaɪ/', '🏖️', 'We swim in July.', '我们七月游泳。'),
  w('August', '八月', '/ˈɔːɡəst/', '🌞', 'August is very hot.', '八月很热。'),
  w('September', '九月', '/sepˈtembər/', '🍁', 'School starts in September.', '九月开学。'),
  w('October', '十月', '/ɑːkˈtoʊbər/', '🎃', 'The leaves fall in October.', '十月树叶落下。'),
  w('November', '十一月', '/noʊˈvembər/', '🍂', 'November is cool.', '十一月天气凉爽。'),
  w('December', '十二月', '/dɪˈsembər/', '🎄', 'We celebrate in December.', '我们十二月庆祝节日。'),
], '🗓️')
const L2_U14 = unit('L2', 14, '四季与时间', 'Seasons & Time', [
  w('spring', '春天', '/sprɪŋ/', '🌸', 'Flowers bloom in spring.', '春天百花盛开。'),
  w('summer', '夏天', '/ˈsʌmər/', '☀️', 'I love summer holidays.', '我喜欢暑假。'),
  w('autumn', '秋天', '/ˈɔːtəm/', '🍂', 'Leaves turn yellow in autumn.', '秋天树叶变黄。'),
  w('winter', '冬天', '/ˈwɪntər/', '❄️', 'It snows in winter.', '冬天下雪。'),
  w('morning', '早晨', '/ˈmɔːrnɪŋ/', '🌅', 'I read in the morning.', '我早晨读书。'),
  w('afternoon', '下午', '/ˌæftərˈnuːn/', '🌤️', 'We play in the afternoon.', '我们下午玩耍。'),
  w('evening', '傍晚', '/ˈiːvnɪŋ/', '🌆', 'We eat dinner in the evening.', '我们傍晚吃晚饭。'),
  w('night', '夜晚', '/naɪt/', '🌙', 'Stars come out at night.', '夜晚星星出来了。'),
  w('hour', '小时', '/ˈaʊər/', '⏰', 'I wait for one hour.', '我等了一个小时。'),
  w('minute', '分钟', '/ˈmɪnɪt/', '⏱️', 'Wait a minute, please.', '请等一分钟。'),
  w('o\'clock', '点钟', '/əˈklɑːk/', '🕐', 'It is three o\'clock.', '现在是三点钟。'),
  w('half past', '半点', '/hæf pæst/', '🕜', 'It is half past two.', '现在是两点半。'),
], '⏳')
const L2_U15 = unit('L2', 15, '形状乐园', 'Shapes', [
  w('circle', '圆形', '/ˈsɜːrkl/', '⭕', 'Draw a circle.', '画一个圆形。'),
  w('square', '正方形', '/skwer/', '⬜', 'The box is a square.', '这个盒子是正方形的。'),
  w('triangle', '三角形', '/ˈtraɪæŋɡl/', '🔺', 'A triangle has three sides.', '三角形有三条边。'),
  w('rectangle', '长方形', '/ˈrektæŋɡl/', '▭', 'The door is a rectangle.', '门是长方形的。'),
  w('star', '星形', '/stɑːr/', '⭐', 'I draw a star.', '我画一个星形。'),
  w('heart', '心形', '/hɑːrt/', '❤️', 'She draws a heart.', '她画了一个心形。'),
  w('oval', '椭圆形', '/ˈoʊvl/', '🥚', 'The egg is oval.', '这个蛋是椭圆形的。'),
  w('diamond', '菱形', '/ˈdaɪəmənd/', '🔶', 'The kite is a diamond shape.', '风筝是菱形的。'),
  w('cube', '立方体', '/kjuːb/', '🧊', 'The dice is a cube.', '骰子是立方体。'),
  w('cone', '圆锥体', '/koʊn/', '🍦', 'The ice cream cone is fun.', '冰淇淋筒很有趣。'),
  w('round', '圆的', '/raʊnd/', '🔵', 'The ball is round.', '球是圆的。'),
  w('shape', '形状', '/ʃeɪp/', '🔷', 'What shape is this?', '这是什么形状？'),
], '🔷')
const L2_U16 = unit('L2', 16, '材质世界', 'Materials', [
  w('wood', '木头', '/wʊd/', '🪵', 'The chair is made of wood.', '椅子是木头做的。'),
  w('plastic', '塑料', '/ˈplæstɪk/', '♻️', 'The cup is plastic.', '这个杯子是塑料的。'),
  w('metal', '金属', '/ˈmetl/', '🔩', 'The spoon is made of metal.', '勺子是金属做的。'),
  w('glass', '玻璃', '/ɡlæs/', '🥛', 'Be careful, it is glass.', '小心，这是玻璃的。'),
  w('paper', '纸', '/ˈpeɪpər/', '📄', 'I write on paper.', '我在纸上写字。'),
  w('cotton', '棉花', '/ˈkɑːtn/', '☁️', 'The shirt is made of cotton.', '衬衫是棉花做的。'),
  w('wool', '羊毛', '/wʊl/', '🐑', 'My sweater is made of wool.', '我的毛衣是羊毛做的。'),
  w('leather', '皮革', '/ˈleðər/', '👜', 'The bag is made of leather.', '包是皮革做的。'),
  w('stone', '石头', '/stoʊn/', '🪨', 'The wall is made of stone.', '墙是石头做的。'),
  w('rubber', '橡胶', '/ˈrʌbər/', '🎈', 'The tire is made of rubber.', '轮胎是橡胶做的。'),
  w('cloth', '布料', '/klɔːθ/', '🧵', 'Use a soft cloth.', '用一块软布。'),
  w('gold', '金子', '/ɡoʊld/', '🥇', 'The ring is made of gold.', '戒指是金子做的。'),
], '🧱')
const L2_U17 = unit('L2', 17, '购物乐园', 'Shopping', [
  w('buy', '购买', '/baɪ/', '🛒', 'I buy an apple.', '我买一个苹果。'),
  w('sell', '出售', '/sel/', '🏷️', 'They sell toys here.', '他们在这里卖玩具。'),
  w('price', '价格', '/praɪs/', '💲', 'What is the price?', '价格是多少？'),
  w('money', '钱', '/ˈmʌni/', '💰', 'I have some money.', '我有一些钱。'),
  w('pay', '付钱', '/peɪ/', '💳', 'I pay for the toy.', '我为玩具付钱。'),
  w('cheap', '便宜的', '/tʃiːp/', '💸', 'This book is cheap.', '这本书很便宜。'),
  w('expensive', '昂贵的', '/ɪkˈspensɪv/', '💎', 'The watch is expensive.', '这块手表很贵。'),
  w('coin', '硬币', '/kɔɪn/', '🪙', 'I have a coin.', '我有一枚硬币。'),
  w('wallet', '钱包', '/ˈwɑːlɪt/', '👛', 'My wallet is red.', '我的钱包是红色的。'),
  w('shopping bag', '购物袋', '/ˈʃɑːpɪŋ bæɡ/', '🛍️', 'Put it in the shopping bag.', '把它放进购物袋。'),
  w('cashier', '收银员', '/kæˈʃɪr/', '🧑‍💼', 'The cashier is friendly.', '收银员很友好。'),
  w('change', '找零', '/tʃeɪndʒ/', '🔄', 'Here is your change.', '这是找您的零钱。'),
], '🛍️')
const L2_U18 = unit('L2', 18, '厨房用品', 'Kitchen Items', [
  w('pot', '锅', '/pɑːt/', '🍲', 'The soup is in the pot.', '汤在锅里。'),
  w('pan', '平底锅', '/pæn/', '🍳', 'Mom fries eggs in the pan.', '妈妈用平底锅煎蛋。'),
  w('spoon', '勺子', '/spuːn/', '🥄', 'I eat soup with a spoon.', '我用勺子喝汤。'),
  w('fork', '叉子', '/fɔːrk/', '🍴', 'Use a fork to eat.', '用叉子吃饭。'),
  w('knife', '刀', '/naɪf/', '🔪', 'Be careful with the knife.', '小心刀子。'),
  w('bowl', '碗', '/boʊl/', '🥣', 'Rice is in the bowl.', '米饭在碗里。'),
  w('plate', '盘子', '/pleɪt/', '🍽️', 'Put the food on the plate.', '把食物放在盘子上。'),
  w('cup', '杯子', '/kʌp/', '☕', 'This is my cup.', '这是我的杯子。'),
  w('glass', '玻璃杯', '/ɡlæs/', '🥛', 'I drink water from a glass.', '我用玻璃杯喝水。'),
  w('kettle', '水壶', '/ˈketl/', '🫖', 'The kettle is hot.', '水壶很烫。'),
  w('oven', '烤箱', '/ˈʌvn/', '🔥', 'The cake is in the oven.', '蛋糕在烤箱里。'),
  w('microwave', '微波炉', '/ˈmaɪkroʊweɪv/', '📻', 'Heat the milk in the microwave.', '用微波炉加热牛奶。'),
], '🍳')
const L2_U19 = unit('L2', 19, '昆虫世界', 'Minibeasts', [
  w('ant', '蚂蚁', '/ænt/', '🐜', 'The ant is very small.', '蚂蚁非常小。'),
  w('snail', '蜗牛', '/sneɪl/', '🐌', 'The snail moves slowly.', '蜗牛移动得很慢。'),
  w('worm', '虫子', '/wɜːrm/', '🪱', 'The worm lives in the soil.', '虫子生活在土里。'),
  w('ladybird', '瓢虫', '/ˈleɪdibɜːrd/', '🐞', 'The ladybird has red wings.', '瓢虫有红色的翅膀。'),
  w('caterpillar', '毛毛虫', '/ˈkætərpɪlər/', '🐛', 'The caterpillar eats leaves.', '毛毛虫吃树叶。'),
  w('dragonfly', '蜻蜓', '/ˈdræɡənflaɪ/', '🚁', 'The dragonfly flies over the lake.', '蜻蜓在湖面上飞。'),
  w('grasshopper', '蚱蜢', '/ˈɡræshɑːpər/', '🍃', 'The grasshopper can jump far.', '蚱蜢能跳得很远。'),
  w('beetle', '甲虫', '/ˈbiːtl/', '🪲', 'The beetle has a hard shell.', '甲虫有坚硬的壳。'),
  w('cricket', '蟋蟀', '/ˈkrɪkɪt/', '🦗', 'I hear a cricket singing.', '我听到蟋蟀在鸣叫。'),
  w('moth', '飞蛾', '/mɔːθ/', '🦋', 'The moth flies at night.', '飞蛾在夜里飞。'),
  w('mosquito', '蚊子', '/məˈskiːtoʊ/', '🦟', 'The mosquito bites me.', '蚊子咬我。'),
  w('fly', '苍蝇', '/flaɪ/', '🪰', 'The fly is on the food.', '苍蝇落在食物上。'),
], '🐛')
const L2_U20 = unit('L2', 20, '海洋生物', 'Sea Creatures', [
  w('shark', '鲨鱼', '/ʃɑːrk/', '🦈', 'The shark swims fast.', '鲨鱼游得很快。'),
  w('octopus', '章鱼', '/ˈɑːktəpəs/', '🐙', 'The octopus has eight arms.', '章鱼有八条腕。'),
  w('starfish', '海星', '/ˈstɑːrfɪʃ/', '⭐', 'I found a starfish.', '我发现了一只海星。'),
  w('crab', '螃蟹', '/kræb/', '🦀', 'The crab walks sideways.', '螃蟹横着走。'),
  w('shrimp', '虾', '/ʃrɪmp/', '🦐', 'I like eating shrimp.', '我喜欢吃虾。'),
  w('jellyfish', '水母', '/ˈdʒelifɪʃ/', '🪼', 'The jellyfish is soft.', '水母软软的。'),
  w('seahorse', '海马', '/ˈsiːhɔːrs/', '🐴', 'The seahorse is tiny.', '海马很小。'),
  w('shell', '贝壳', '/ʃel/', '🐚', 'I collect shells.', '我收集贝壳。'),
  w('coral', '珊瑚', '/ˈkɔːrəl/', '🪸', 'The coral is colorful.', '珊瑚色彩斑斓。'),
  w('seal', '海豹', '/siːl/', '🦭', 'The seal claps its fins.', '海豹拍打它的鳍。'),
  w('penguin', '企鹅', '/ˈpeŋɡwɪn/', '🐧', 'The penguin cannot fly.', '企鹅不会飞。'),
  w('walrus', '海象', '/ˈwɔːlrəs/', '🧊', 'The walrus has long tusks.', '海象有长长的獠牙。'),
], '🐠')
const L2_U21 = unit('L2', 21, '户外探险', 'Camping & Outdoors', [
  w('tent', '帐篷', '/tent/', '⛺', 'We sleep in a tent.', '我们睡在帐篷里。'),
  w('sleeping bag', '睡袋', '/ˈsliːpɪŋ bæɡ/', '🛌', 'I have a warm sleeping bag.', '我有一个暖和的睡袋。'),
  w('torch', '手电筒', '/tɔːrtʃ/', '🔦', 'Use a torch at night.', '夜里用手电筒。'),
  w('campfire', '篝火', '/ˈkæmpfaɪər/', '🔥', 'We sit around the campfire.', '我们围坐在篝火旁。'),
  w('backpack', '背包', '/ˈbækpæk/', '🎒', 'Pack your backpack.', '收拾好你的背包。'),
  w('compass', '指南针', '/ˈkʌmpəs/', '🧭', 'A compass shows direction.', '指南针指示方向。'),
  w('map', '地图', '/mæp/', '🗺️', 'Check the map first.', '先看看地图。'),
  w('binoculars', '望远镜', '/bɪˈnɑːkjələrz/', '🔭', 'I see birds with binoculars.', '我用望远镜看鸟。'),
  w('rope', '绳子', '/roʊp/', '🪢', 'Tie the rope tightly.', '把绳子系紧。'),
  w('flashlight', '手电', '/ˈflæʃlaɪt/', '💡', 'The flashlight is bright.', '手电很亮。'),
  w('hiking', '徒步旅行', '/ˈhaɪkɪŋ/', '🥾', 'We go hiking in the hills.', '我们去山里徒步。'),
  w('picnic', '野餐', '/ˈpɪknɪk/', '🧺', 'Let\'s have a picnic.', '我们去野餐吧。'),
], '🏕️')
const L2_U22 = unit('L2', 22, '通讯天地', 'Communication', [
  w('letter', '信', '/ˈletər/', '✉️', 'I write a letter to grandma.', '我给奶奶写信。'),
  w('stamp', '邮票', '/stæmp/', '📮', 'Put a stamp on the letter.', '在信上贴邮票。'),
  w('postcard', '明信片', '/ˈpoʊstkɑːrd/', '🖼️', 'I send a postcard from the beach.', '我从海边寄了一张明信片。'),
  w('envelope', '信封', '/ˈenvəloʊp/', '💌', 'Put the letter in an envelope.', '把信放进信封。'),
  w('phone', '电话', '/foʊn/', '📱', 'My phone is ringing.', '我的电话在响。'),
  w('email', '电子邮件', '/ˈiːmeɪl/', '📧', 'I send an email to my friend.', '我给朋友发电子邮件。'),
  w('camera', '相机', '/ˈkæmrə/', '📷', 'Take a photo with the camera.', '用相机拍照。'),
  w('internet', '网络', '/ˈɪntərnet/', '🌐', 'I search on the internet.', '我在网上搜索。'),
  w('message', '信息', '/ˈmesɪdʒ/', '💬', 'I got a new message.', '我收到一条新信息。'),
  w('mailbox', '邮箱', '/ˈmeɪlbɑːks/', '📪', 'The letter is in the mailbox.', '信在邮箱里。'),
  w('post office', '邮局', '/poʊst ˈɔːfɪs/', '🏤', 'I go to the post office.', '我去邮局。'),
  w('address', '地址', '/ˈædres/', '🏠', 'Write your address here.', '在这里写上你的地址。'),
], '📮')
const L2_U23 = unit('L2', 23, '国家与语言', 'Countries & Languages', [
  w('China', '中国', '/ˈtʃaɪnə/', '🇨🇳', 'I live in China.', '我住在中国。'),
  w('America', '美国', '/əˈmerɪkə/', '🇺🇸', 'She comes from America.', '她来自美国。'),
  w('England', '英国', '/ˈɪŋɡlənd/', '🇬🇧', 'Big Ben is in England.', '大本钟在英国。'),
  w('Japan', '日本', '/dʒəˈpæn/', '🇯🇵', 'Sushi is from Japan.', '寿司来自日本。'),
  w('France', '法国', '/fræns/', '🇫🇷', 'The tower is in France.', '这座塔在法国。'),
  w('Australia', '澳大利亚', '/ɔːˈstreɪliə/', '🇦🇺', 'Kangaroos live in Australia.', '袋鼠生活在澳大利亚。'),
  w('Canada', '加拿大', '/ˈkænədə/', '🇨🇦', 'Canada is very big.', '加拿大非常大。'),
  w('Chinese', '中文', '/ˌtʃaɪˈniːz/', '🈶', 'I can speak Chinese.', '我会说中文。'),
  w('English', '英语', '/ˈɪŋɡlɪʃ/', '🔤', 'We learn English at school.', '我们在学校学英语。'),
  w('Japanese', '日语', '/ˌdʒæpəˈniːz/', '🀄', 'My sister learns Japanese.', '我姐姐学日语。'),
  w('French', '法语', '/frentʃ/', '🥖', 'He speaks French well.', '他法语说得很好。'),
  w('country', '国家', '/ˈkʌntri/', '🗺️', 'China is a big country.', '中国是一个大国家。'),
], '🌍')
const L2_U24 = unit('L2', 24, '生活形容词', 'Descriptive Words', [
  w('fast', '快的', '/fæst/', '🏎️', 'The car is very fast.', '这辆车很快。'),
  w('slow', '慢的', '/sloʊ/', '🐢', 'The turtle is slow.', '乌龟很慢。'),
  w('heavy', '重的', '/ˈhevi/', '🏋️', 'The box is heavy.', '这个盒子很重。'),
  w('light', '轻的', '/laɪt/', '🪶', 'The feather is light.', '羽毛很轻。'),
  w('wet', '湿的', '/wet/', '💦', 'My shoes are wet.', '我的鞋是湿的。'),
  w('dry', '干的', '/draɪ/', '☀️', 'The towel is dry now.', '毛巾现在是干的。'),
  w('clean', '干净的', '/kliːn/', '🧼', 'My room is clean.', '我的房间很干净。'),
  w('dirty', '脏的', '/ˈdɜːrti/', '🧽', 'My hands are dirty.', '我的手很脏。'),
  w('full', '满的', '/fʊl/', '🧃', 'The glass is full.', '杯子是满的。'),
  w('empty', '空的', '/ˈempti/', '🕳️', 'The box is empty.', '盒子是空的。'),
  w('easy', '容易的', '/ˈiːzi/', '😊', 'This game is easy.', '这个游戏很容易。'),
  w('difficult', '困难的', '/ˈdɪfɪkəlt/', '😓', 'The test is difficult.', '这次考试很难。'),
], '✨')

function placeholderUnits(levelId: string, titles: string[]): UnitData[] {
  return titles.map((t, i) => unit(levelId, i + 1, t, '', []))
}

export const LEVELS: LevelData[] = [
  {
    id: 'L1',
    name: 'Power Up 1',
    ageRange: '6岁',
    cefr: 'Pre-A1',
    cambridge: 'YLE Starters',
    vocabTarget: 300,
    color: 'rose',
    gradient: 'from-rose-300 to-pink-400',
    units: [
      L1_U1, L1_U2, L1_U3, L1_U4, L1_U5, L1_U6, L1_U7, L1_U8, L1_U9, L1_U10,
      L1_U11, L1_U12, L1_U13, L1_U14, L1_U15, L1_U16, L1_U17, L1_U18, L1_U19, L1_U20,
      L1_U21, L1_U22, L1_U23, L1_U24, L1_U25, L1_U26, L1_U27,
    ],
  },
  {
    id: 'L2',
    name: 'Power Up 2',
    ageRange: '6-7岁',
    cefr: 'A1',
    cambridge: 'YLE Movers',
    vocabTarget: 600,
    color: 'orange',
    gradient: 'from-orange-300 to-amber-400',
    units: [
      L2_U1, L2_U2, L2_U3, L2_U4, L2_U5, L2_U6, L2_U7, L2_U8, L2_U9, L2_U10,
      L2_U11, L2_U12, L2_U13, L2_U14, L2_U15, L2_U16, L2_U17, L2_U18, L2_U19, L2_U20,
      L2_U21, L2_U22, L2_U23, L2_U24,
    ],
  },
  {
    id: 'L3',
    name: 'Power Up 3',
    ageRange: '7岁',
    cefr: 'A2',
    cambridge: 'YLE Flyers',
    vocabTarget: 800,
    color: 'lime',
    gradient: 'from-lime-300 to-green-400',
    units: placeholderUnits('L3', [
      '校园生活', '周末计划', '科学小实验', '旅行地图', '购物街',
      '美食世界', '动物王国', '四季变化', '梦想职业（复习）',
    ]),
  },
  {
    id: 'L4',
    name: 'Power Up 4',
    ageRange: '7-8岁',
    cefr: 'A2',
    cambridge: 'Pre-KET',
    vocabTarget: 1000,
    color: 'teal',
    gradient: 'from-teal-300 to-cyan-400',
    units: placeholderUnits('L4', [
      '城市探索', '健康生活', '太空探秘', '历史故事', '环境保护',
      '艺术天地', '体育竞赛', '奇妙发明', '未来世界（复习）',
    ]),
  },
  {
    id: 'L5',
    name: 'Power Up 5',
    ageRange: '8-9岁',
    cefr: 'A2-B1',
    cambridge: 'KET',
    vocabTarget: 1300,
    color: 'sky',
    gradient: 'from-sky-300 to-blue-400',
    units: placeholderUnits('L5', [
      '媒体与新闻', '社会话题', '世界文化', '科技生活', '自然灾害',
      '经济常识', '人物传记', '辩论表达', '综合复习',
    ]),
  },
  {
    id: 'L6',
    name: 'Power Up 6',
    ageRange: '9-12岁',
    cefr: 'B1',
    cambridge: 'PET',
    vocabTarget: 1600,
    color: 'violet',
    gradient: 'from-violet-300 to-purple-400',
    units: placeholderUnits('L6', [
      '学术写作', '议论文表达', '全球议题', '文学赏析', '演讲技巧',
      '批判思维', '跨学科阅读', '模拟考场', '毕业挑战（复习）',
    ]),
  },
]

export function getAllUnits(): UnitData[] {
  return LEVELS.flatMap((l) => l.units)
}

export function findUnit(unitId: string): UnitData | undefined {
  return getAllUnits().find((u) => u.id === unitId)
}

export function findWord(wordId: string): WordItem | undefined {
  for (const u of getAllUnits()) {
    const found = u.words.find((wd) => wd.id === wordId)
    if (found) return found
  }
  return undefined
}

export function findLevel(levelId: string): LevelData | undefined {
  return LEVELS.find((l) => l.id === levelId)
}
