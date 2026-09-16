import type { UnitData } from '../../types'
import { w, unit } from './words'

// ---------------- Level 3 (YLE Flyers, ~800 词，每单元约 11 词) ----------------
const L3_U1 = unit('L3', 1, '校园生活', 'School Life', [
  w('subject', '科目', '/ˈsʌbdʒɪkt/', '📚', 'Math is my favorite subject.', '数学是我最喜欢的科目。'),
  w('math', '数学', '/mæθ/', '🔢', 'I do my math homework.', '我在做数学作业。'),
  w('science', '科学', '/ˈsaɪəns/', '🔬', 'We learn science on Friday.', '我们星期五上科学课。'),
  w('art', '美术', '/ɑːrt/', '🎨', 'I love art class.', '我喜欢美术课。'),
  w('music', '音乐', '/ˈmjuːzɪk/', '🎵', 'She plays music every day.', '她每天演奏音乐。'),
  w('P.E.', '体育', '/ˌpiː ˈiː/', '🏃', 'We have P.E. on Monday.', '我们星期一上体育课。'),
  w('history', '历史', '/ˈhɪstəri/', '🏺', 'History class is interesting.', '历史课很有趣。'),
  w('playground', '操场', '/ˈpleɪɡraʊnd/', '🛝', 'We play on the playground.', '我们在操场上玩。'),
  w('principal', '校长', '/ˈprɪnsəpl/', '🧑‍💼', 'The principal visits our class.', '校长来我们班参观。'),
  w('classmate', '同学', '/ˈklæsmeɪt/', '🧑‍🤝‍🧑', 'He is my classmate.', '他是我的同学。'),
  w('exam', '考试', '/ɪɡˈzæm/', '📝', 'I study for the exam.', '我为考试而学习。'),
], '🏫')
const L3_U2 = unit('L3', 2, '周末计划', 'Weekend Plans', [
  w('plan', '计划', '/plæn/', '🗒️', 'What is your plan for Sunday?', '你周日有什么计划？'),
  w('visit', '拜访', '/ˈvɪzɪt/', '🏠', 'We visit grandma on weekends.', '我们周末去看奶奶。'),
  w('relax', '放松', '/rɪˈlæks/', '🛀', 'I relax at home on Saturday.', '我周六在家放松。'),
  w('invite', '邀请', '/ɪnˈvaɪt/', '💌', 'I invite my friends to my party.', '我邀请朋友来参加我的聚会。'),
  w('outing', '郊游', '/ˈaʊtɪŋ/', '🚌', 'We go on a family outing.', '我们一家人去郊游。'),
  w('amusement park', '游乐园', '/əˈmjuːzmənt pɑːrk/', '🎡', 'We ride the Ferris wheel at the amusement park.', '我们在游乐园坐摩天轮。'),
  w('board game', '桌游', '/bɔːrd ɡeɪm/', '🎲', "Let's play a board game.", '我们玩桌游吧。'),
  w('comic book', '漫画书', '/ˈkɑːmɪk bʊk/', '📗', 'I read a comic book.', '我读一本漫画书。'),
  w('sleepover', '借宿聚会', '/ˈsliːpoʊvər/', '🛌', 'We have a sleepover on Friday.', '我们星期五举办借宿聚会。'),
  w('errand', '差事', '/ˈerənd/', '🛒', 'Mom runs errands on Saturday.', '妈妈周六去办事。'),
  w('free time', '空闲时间', '/friː taɪm/', '⏳', 'I read in my free time.', '我空闲时间读书。'),
], '🎡')
const L3_U3 = unit('L3', 3, '科学小实验', 'Science Experiments', [
  w('experiment', '实验', '/ɪkˈsperɪmənt/', '🧪', 'We do an experiment in class.', '我们在课堂上做实验。'),
  w('magnet', '磁铁', '/ˈmæɡnɪt/', '🧲', 'The magnet pulls the metal.', '磁铁吸引金属。'),
  w('magnifying glass', '放大镜', '/ˈmæɡnɪfaɪɪŋ ɡlæs/', '🔍', 'I look at the ant with a magnifying glass.', '我用放大镜看蚂蚁。'),
  w('mix', '混合', '/mɪks/', '🥣', 'Mix the blue and yellow paint.', '混合蓝色和黄色的颜料。'),
  w('liquid', '液体', '/ˈlɪkwɪd/', '💧', 'Water is a liquid.', '水是液体。'),
  w('solid', '固体', '/ˈsɑːlɪd/', '🧊', 'Ice is a solid.', '冰是固体。'),
  w('gas', '气体', '/ɡæs/', '☁️', 'Steam turns into gas.', '蒸汽变成气体。'),
  w('melt', '融化', '/melt/', '🍦', 'The ice cream will melt.', '冰淇淋会融化。'),
  w('freeze', '冷冻', '/friːz/', '❄️', 'Water will freeze at night.', '水晚上会冻结。'),
  w('float', '漂浮', '/floʊt/', '🛟', 'The boat can float on water.', '船能漂浮在水上。'),
  w('sink', '下沉', '/sɪŋk/', '⚓', 'The stone will sink in water.', '石头会沉入水中。'),
], '🧪')
const L3_U4 = unit('L3', 4, '旅行地图', 'Travel & Maps', [
  w('journey', '旅程', '/ˈdʒɜːrni/', '🧳', 'We start our journey early.', '我们很早就开始旅程。'),
  w('passport', '护照', '/ˈpæspɔːrt/', '🛂', "Don't forget your passport.", '别忘了你的护照。'),
  w('luggage', '行李', '/ˈlʌɡɪdʒ/', '🧳', 'Pack your luggage tonight.', '今晚打包你的行李。'),
  w('airport', '机场', '/ˈerpɔːrt/', '✈️', 'We arrive at the airport at six.', '我们六点到达机场。'),
  w('ticket', '票', '/ˈtɪkɪt/', '🎫', 'I buy a train ticket.', '我买了一张火车票。'),
  w('hotel', '酒店', '/hoʊˈtel/', '🏨', 'We stay at a nice hotel.', '我们住在一家不错的酒店。'),
  w('tourist', '游客', '/ˈtʊrɪst/', '🧑‍🦱', 'Many tourists visit the city.', '很多游客参观这座城市。'),
  w('souvenir', '纪念品', '/ˌsuːvəˈnɪr/', '🎁', 'I buy a souvenir for my mom.', '我给妈妈买一个纪念品。'),
  w('guide', '向导', '/ɡaɪd/', '🗺️', 'The guide shows us the museum.', '向导带我们参观博物馆。'),
  w('destination', '目的地', '/ˌdestɪˈneɪʃn/', '📍', 'Our destination is Paris.', '我们的目的地是巴黎。'),
  w('abroad', '国外', '/əˈbrɔːd/', '🌍', 'She studies abroad.', '她在国外留学。'),
], '🧳')
const L3_U5 = unit('L3', 5, '购物街', 'Shopping Street', [
  w('department store', '百货商店', '/dɪˈpɑːrtmənt stɔːr/', '🏬', 'We shop at the department store.', '我们在百货商店购物。'),
  w('mall', '购物中心', '/mɔːl/', '🏢', 'There is a new mall in town.', '镇上有一个新的购物中心。'),
  w('discount', '折扣', '/ˈdɪskaʊnt/', '🏷️', 'This shirt has a big discount.', '这件衬衫打折很多。'),
  w('receipt', '收据', '/rɪˈsiːt/', '🧾', 'Keep your receipt.', '保留好你的收据。'),
  w('size', '尺码', '/saɪz/', '📏', 'What size do you wear?', '你穿多大尺码？'),
  w('try on', '试穿', '/traɪ ɑːn/', '👗', 'Can I try on this dress?', '我可以试穿这件裙子吗？'),
  w('fitting room', '试衣间', '/ˈfɪtɪŋ ruːm/', '🚪', 'The fitting room is over there.', '试衣间在那边。'),
  w('customer', '顾客', '/ˈkʌstəmər/', '🧑‍🦰', 'The customer is happy.', '顾客很满意。'),
  w('bargain', '讨价还价', '/ˈbɑːrɡən/', '🤝', 'Dad likes to bargain.', '爸爸喜欢讨价还价。'),
  w('refund', '退款', '/ˈriːfʌnd/', '💸', 'I ask for a refund.', '我要求退款。'),
  w('brand', '品牌', '/brænd/', '🏷️', 'This is a famous brand.', '这是一个著名品牌。'),
], '🏬')
const L3_U6 = unit('L3', 6, '美食世界', 'World of Food', [
  w('recipe', '食谱', '/ˈresəpi/', '📋', 'Mom follows a new recipe.', '妈妈跟着一个新食谱做饭。'),
  w('ingredient', '食材', '/ɪnˈɡriːdiənt/', '🥕', 'Flour is an ingredient.', '面粉是一种食材。'),
  w('delicious', '美味的', '/dɪˈlɪʃəs/', '😋', 'This soup is delicious.', '这汤很美味。'),
  w('spicy', '辣的', '/ˈspaɪsi/', '🌶️', 'I like spicy food.', '我喜欢辣的食物。'),
  w('sour', '酸的', '/ˈsaʊər/', '🍋', 'The lemon is sour.', '柠檬是酸的。'),
  w('bitter', '苦的', '/ˈbɪtər/', '☕', 'Coffee tastes bitter.', '咖啡的味道是苦的。'),
  w('salty', '咸的', '/ˈsɔːlti/', '🧂', 'The soup is too salty.', '汤太咸了。'),
  w('flavor', '味道', '/ˈfleɪvər/', '👅', 'I like the flavor of mango.', '我喜欢芒果的味道。'),
  w('dessert', '甜点', '/dɪˈzɜːrt/', '🍮', 'We have dessert after dinner.', '我们晚饭后吃甜点。'),
  w('appetizer', '开胃菜', '/ˈæpɪtaɪzər/', '🥗', 'The salad is an appetizer.', '沙拉是一道开胃菜。'),
  w('chef', '主厨', '/ʃef/', '👨‍🍳', 'The chef cooks a big meal.', '主厨做了一顿丰盛的饭。'),
], '🍜')
const L3_U7 = unit('L3', 7, '动物王国', 'Animal Kingdom', [
  w('mammal', '哺乳动物', '/ˈmæml/', '🐘', 'A whale is a mammal.', '鲸鱼是哺乳动物。'),
  w('reptile', '爬行动物', '/ˈreptaɪl/', '🦎', 'A lizard is a reptile.', '蜥蜴是爬行动物。'),
  w('insect', '昆虫', '/ˈɪnsekt/', '🐝', 'A bee is an insect.', '蜜蜂是昆虫。'),
  w('amphibian', '两栖动物', '/æmˈfɪbiən/', '🐸', 'A frog is an amphibian.', '青蛙是两栖动物。'),
  w('predator', '捕食者', '/ˈpredətər/', '🦅', 'The eagle is a predator.', '鹰是捕食者。'),
  w('prey', '猎物', '/preɪ/', '🐭', "The mouse is the cat's prey.", '老鼠是猫的猎物。'),
  w('habitat', '栖息地', '/ˈhæbɪtæt/', '🌳', "The forest is the tiger's habitat.", '森林是老虎的栖息地。'),
  w('endangered', '濒危的', '/ɪnˈdeɪndʒərd/', '🐼', 'Pandas are endangered animals.', '熊猫是濒危动物。'),
  w('wildlife', '野生动物', '/ˈwaɪldlaɪf/', '🦓', 'We protect the wildlife.', '我们保护野生动物。'),
  w('species', '物种', '/ˈspiːʃiːz/', '🐋', 'This is a rare species.', '这是一种稀有物种。'),
  w('nocturnal', '夜行的', '/nɑːkˈtɜːrnl/', '🦉', 'Owls are nocturnal birds.', '猫头鹰是夜行鸟类。'),
], '🐘')
const L3_U8 = unit('L3', 8, '四季变化', 'Seasons & Change', [
  w('climate', '气候', '/ˈklaɪmət/', '🌡️', 'The climate is changing.', '气候在变化。'),
  w('temperature', '温度', '/ˈtemprətʃər/', '🌡️', 'The temperature is rising.', '温度在上升。'),
  w('harvest', '收获', '/ˈhɑːrvɪst/', '🌾', 'Farmers harvest rice in autumn.', '农民秋天收割稻子。'),
  w('bloom', '开花', '/bluːm/', '🌸', 'Flowers bloom in spring.', '花在春天开放。'),
  w('migrate', '迁徙', '/ˈmaɪɡreɪt/', '🦢', 'Birds migrate south in winter.', '鸟儿冬天向南迁徙。'),
  w('hibernate', '冬眠', '/ˈhaɪbərneɪt/', '🐻', 'Bears hibernate in winter.', '熊在冬天冬眠。'),
  w('change', '变化', '/tʃeɪndʒ/', '🔄', 'The leaves change color.', '树叶变色了。'),
  w('weather forecast', '天气预报', '/ˈweðər ˈfɔːrkæst/', '📺', 'I watch the weather forecast.', '我看天气预报。'),
  w('thermometer', '温度计', '/θərˈmɑːmɪtər/', '🌡️', 'Use a thermometer to check the temperature.', '用温度计检查温度。'),
  w('frost', '霜', '/frɔːst/', '❄️', 'There is frost on the grass.', '草地上有霜。'),
  w('drought', '干旱', '/draʊt/', '☀️', 'The drought lasted a long time.', '干旱持续了很长时间。'),
], '🍂')
const L3_U9 = unit('L3', 9, '梦想职业（复习）', 'Dream Jobs', [
  w('engineer', '工程师', '/ˌendʒɪˈnɪr/', '👷', 'My uncle is an engineer.', '我叔叔是工程师。'),
  w('scientist', '科学家', '/ˈsaɪəntɪst/', '🧑‍🔬', 'The scientist works in a lab.', '科学家在实验室工作。'),
  w('astronaut', '宇航员', '/ˈæstrənɔːt/', '🧑‍🚀', 'The astronaut flies to space.', '宇航员飞向太空。'),
  w('journalist', '记者', '/ˈdʒɜːrnəlɪst/', '📰', 'The journalist writes news stories.', '记者写新闻报道。'),
  w('lawyer', '律师', '/ˈlɔɪər/', '⚖️', 'The lawyer helps people.', '律师帮助人们。'),
  w('architect', '建筑师', '/ˈɑːrkɪtekt/', '📐', 'The architect designs buildings.', '建筑师设计建筑物。'),
  w('programmer', '程序员', '/ˈproʊɡræmər/', '💻', 'The programmer writes code.', '程序员编写代码。'),
  w('designer', '设计师', '/dɪˈzaɪnər/', '🎨', 'The designer makes clothes.', '设计师制作衣服。'),
  w('photographer', '摄影师', '/fəˈtɑːɡrəfər/', '📷', 'The photographer takes great photos.', '摄影师拍出很棒的照片。'),
  w('athlete', '运动员', '/ˈæθliːt/', '🏅', 'The athlete trains every day.', '运动员每天训练。'),
  w('dream job', '梦想工作', '/driːm dʒɑːb/', '⭐', 'What is your dream job?', '你的梦想工作是什么？'),
], '⭐')

export const L3_UNITS: UnitData[] = [
  L3_U1, L3_U2, L3_U3, L3_U4, L3_U5, L3_U6, L3_U7, L3_U8, L3_U9,
]
