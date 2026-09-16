import type { UnitData } from '../../types'
import { w, unit } from './words'

// ---------------- Level 4 (Pre-KET, ~1000 词，每单元约 11 词) ----------------
const L4_U1 = unit('L4', 1, '城市探索', 'City Exploration', [
  w('skyscraper', '摩天大楼', '/ˈskaɪskreɪpər/', '🏙️', 'The skyscraper is very tall.', '这座摩天大楼非常高。'),
  w('traffic', '交通', '/ˈtræfɪk/', '🚦', 'The traffic is heavy today.', '今天交通很拥堵。'),
  w('crosswalk', '人行横道', '/ˈkrɔːswɔːk/', '🚶', 'Cross at the crosswalk.', '在人行横道过马路。'),
  w('traffic light', '交通灯', '/ˈtræfɪk laɪt/', '🚥', 'Stop at the traffic light.', '在交通灯处停下。'),
  w('pedestrian', '行人', '/pəˈdestriən/', '🚶‍♀️', 'Pedestrians walk on the sidewalk.', '行人在人行道上走。'),
  w('neighborhood', '社区', '/ˈneɪbərhʊd/', '🏘️', 'I live in a quiet neighborhood.', '我住在一个安静的社区。'),
  w('downtown', '市中心', '/ˌdaʊnˈtaʊn/', '🏢', 'We go downtown on weekends.', '我们周末去市中心。'),
  w('suburb', '郊区', '/ˈsʌbɜːrb/', '🏡', 'They live in the suburbs.', '他们住在郊区。'),
  w('apartment', '公寓', '/əˈpɑːrtmənt/', '🏠', 'My apartment is on the tenth floor.', '我的公寓在十楼。'),
  w('elevator', '电梯', '/ˈelɪveɪtər/', '🛗', 'Take the elevator to the third floor.', '坐电梯到三楼。'),
  w('escalator', '自动扶梯', '/ˈeskəleɪtər/', '🔼', "Let's take the escalator.", '我们坐自动扶梯吧。'),
], '🏙️')
const L4_U2 = unit('L4', 2, '健康生活', 'Healthy Living', [
  w('exercise', '锻炼', '/ˈeksərsaɪz/', '🏋️', 'I exercise every morning.', '我每天早上锻炼。'),
  w('diet', '饮食', '/ˈdaɪət/', '🥗', 'A healthy diet is important.', '健康的饮食很重要。'),
  w('nutrition', '营养', '/nuːˈtrɪʃn/', '🍎', 'Good nutrition keeps us strong.', '良好的营养让我们强壮。'),
  w('vitamin', '维生素', '/ˈvaɪtəmɪn/', '💊', 'Oranges have vitamin C.', '橙子含有维生素C。'),
  w('balanced', '均衡的', '/ˈbælənst/', '⚖️', 'Eat a balanced meal.', '吃一顿均衡的饭。'),
  w('fitness', '健身', '/ˈfɪtnəs/', '💪', 'She goes to a fitness class.', '她去上健身课。'),
  w('hygiene', '卫生', '/ˈhaɪdʒiːn/', '🧼', 'Good hygiene keeps you healthy.', '良好的卫生习惯让你保持健康。'),
  w('checkup', '体检', '/ˈtʃekʌp/', '🩺', 'I have a checkup every year.', '我每年做一次体检。'),
  w('symptom', '症状', '/ˈsɪmptəm/', '🤒', 'A fever is a symptom of a cold.', '发烧是感冒的一种症状。'),
  w('medicine', '药', '/ˈmedɪsn/', '💊', 'Take your medicine after dinner.', '晚饭后吃药。'),
  w('rest', '休息', '/rest/', '😴', "You need rest when you're sick.", '你生病时需要休息。'),
], '💪')
const L4_U3 = unit('L4', 3, '太空探秘', 'Space Exploration', [
  w('rocket', '火箭', '/ˈrɑːkɪt/', '🚀', 'The rocket flies into space.', '火箭飞向太空。'),
  w('satellite', '卫星', '/ˈsætəlaɪt/', '🛰️', "The satellite orbits the Earth.", '卫星绕地球运行。'),
  w('spacecraft', '宇宙飞船', '/ˈspeɪskræft/', '🛰️', 'The spacecraft lands on the moon.', '宇宙飞船登陆月球。'),
  w('orbit', '轨道', '/ˈɔːrbɪt/', '🪐', "The Earth's orbit takes a year.", '地球的轨道运行需要一年。'),
  w('gravity', '引力', '/ˈɡrævəti/', '🌍', 'Gravity keeps us on the ground.', '引力让我们留在地面上。'),
  w('universe', '宇宙', '/ˈjuːnɪvɜːrs/', '🌌', 'The universe is huge.', '宇宙非常巨大。'),
  w('comet', '彗星', '/ˈkɑːmɪt/', '☄️', 'We saw a comet last night.', '我们昨晚看到了一颗彗星。'),
  w('asteroid', '小行星', '/ˈæstərɔɪd/', '🪨', 'The asteroid is near Mars.', '这颗小行星靠近火星。'),
  w('telescope', '望远镜', '/ˈtelɪskoʊp/', '🔭', 'I look at stars with a telescope.', '我用望远镜看星星。'),
  w('astronaut', '宇航员', '/ˈæstrənɔːt/', '🧑‍🚀', 'The astronaut walks in space.', '宇航员在太空行走。'),
  w('galaxy', '星系', '/ˈɡæləksi/', '🌠', 'Our galaxy is called the Milky Way.', '我们的星系叫银河系。'),
], '🚀')
const L4_U4 = unit('L4', 4, '历史故事', 'History Stories', [
  w('ancient', '古代的', '/ˈeɪnʃənt/', '🏛️', 'This is an ancient temple.', '这是一座古代寺庙。'),
  w('civilization', '文明', '/ˌsɪvələˈzeɪʃn/', '🏺', 'Egypt has a great civilization.', '埃及有伟大的文明。'),
  w('castle', '城堡', '/ˈkæsl/', '🏰', 'The king lives in a castle.', '国王住在城堡里。'),
  w('knight', '骑士', '/naɪt/', '⚔️', 'The knight rides a horse.', '骑士骑着马。'),
  w('king', '国王', '/kɪŋ/', '👑', 'The king rules the country.', '国王统治这个国家。'),
  w('queen', '女王', '/kwiːn/', '👸', 'The queen wears a crown.', '女王戴着王冠。'),
  w('empire', '帝国', '/ˈempaɪər/', '🗺️', 'The empire was very large.', '这个帝国非常庞大。'),
  w('legend', '传说', '/ˈledʒənd/', '📖', 'It is an old legend.', '这是一个古老的传说。'),
  w('ruins', '遗迹', '/ˈruːɪnz/', '🏯', 'We visit ancient ruins.', '我们参观古代遗迹。'),
  w('discover', '发现', '/dɪˈskʌvər/', '🔍', 'He discovers a new island.', '他发现了一个新岛屿。'),
  w('explorer', '探险家', '/ɪkˈsplɔːrər/', '🧭', 'The explorer travels far away.', '探险家去很远的地方旅行。'),
], '🏰')
const L4_U5 = unit('L4', 5, '环境保护', 'Environment Protection', [
  w('pollution', '污染', '/pəˈluːʃn/', '🏭', 'Air pollution is bad for health.', '空气污染对健康不好。'),
  w('recycle', '回收', '/riːˈsaɪkl/', '♻️', 'We recycle paper and bottles.', '我们回收纸张和瓶子。'),
  w('environment', '环境', '/ɪnˈvaɪrənmənt/', '🌍', 'Protect the environment.', '保护环境。'),
  w('protect', '保护', '/prəˈtekt/', '🛡️', 'We protect wild animals.', '我们保护野生动物。'),
  w('waste', '垃圾', '/weɪst/', '🗑️', "Don't waste food.", '别浪费食物。'),
  w('reduce', '减少', '/rɪˈduːs/', '📉', 'Reduce plastic use.', '减少塑料使用。'),
  w('reuse', '再利用', '/riːˈjuːz/', '🔁', 'Reuse the bag.', '重复利用这个袋子。'),
  w('renewable', '可再生的', '/rɪˈnuːəbl/', '☀️', 'Solar power is renewable energy.', '太阳能是可再生能源。'),
  w('conserve', '节约', '/kənˈsɜːrv/', '💧', 'We conserve water at home.', '我们在家节约用水。'),
  w('ecosystem', '生态系统', '/ˈiːkoʊsɪstəm/', '🌿', 'The forest is an ecosystem.', '森林是一个生态系统。'),
  w('carbon', '碳', '/ˈkɑːrbən/', '💨', 'Cars produce carbon dioxide.', '汽车排放二氧化碳。'),
], '♻️')
const L4_U6 = unit('L4', 6, '艺术天地', 'Art World', [
  w('painting', '绘画', '/ˈpeɪntɪŋ/', '🖼️', 'This painting is beautiful.', '这幅画很美。'),
  w('sculpture', '雕塑', '/ˈskʌlptʃər/', '🗿', 'The sculpture is made of stone.', '这个雕塑是石头做的。'),
  w('gallery', '画廊', '/ˈɡæləri/', '🏛️', 'We visit an art gallery.', '我们参观一个美术馆。'),
  w('exhibition', '展览', '/ˌeksɪˈbɪʃn/', '🖼️', 'There is an art exhibition today.', '今天有一个艺术展览。'),
  w('portrait', '肖像', '/ˈpɔːrtrət/', '🖼️', 'The artist paints a portrait.', '艺术家画一幅肖像。'),
  w('canvas', '画布', '/ˈkænvəs/', '🎨', 'She paints on canvas.', '她在画布上作画。'),
  w('palette', '调色板', '/ˈpælət/', '🎨', 'The painter holds a palette.', '画家拿着调色板。'),
  w('masterpiece', '杰作', '/ˈmæstərpiːs/', '🖼️', 'This is his masterpiece.', '这是他的杰作。'),
  w('sketch', '素描', '/sketʃ/', '✏️', 'I sketch a tree.', '我画一棵树的素描。'),
  w('watercolor', '水彩', '/ˈwɔːtərkʌlər/', '🎨', 'I paint with watercolor.', '我用水彩画画。'),
  w('craft', '手工艺', '/kræft/', '✂️', 'We make crafts in class.', '我们在课堂上做手工艺品。'),
], '🎨')
const L4_U7 = unit('L4', 7, '体育竞赛', 'Sports Competition', [
  w('championship', '锦标赛', '/ˈtʃæmpiənʃɪp/', '🏆', 'Our team wins the championship.', '我们队赢得了锦标赛。'),
  w('medal', '奖牌', '/ˈmedl/', '🥇', 'She gets a gold medal.', '她获得了一枚金牌。'),
  w('referee', '裁判', '/ˌrefəˈriː/', '👨‍⚖️', 'The referee blows the whistle.', '裁判吹哨。'),
  w('teamwork', '团队合作', '/ˈtiːmwɜːrk/', '🤝', 'Teamwork helps us win.', '团队合作帮助我们获胜。'),
  w('opponent', '对手', '/əˈpoʊnənt/', '🥊', 'Our opponent plays well.', '我们的对手打得很好。'),
  w('victory', '胜利', '/ˈvɪktəri/', '🎉', 'We celebrate our victory.', '我们庆祝胜利。'),
  w('defeat', '失败', '/dɪˈfiːt/', '😔', 'We accept the defeat.', '我们接受失败。'),
  w('score', '得分', '/skɔːr/', '🔢', 'What is the score?', '比分是多少？'),
  w('stadium', '体育场', '/ˈsteɪdiəm/', '🏟️', 'The stadium is full of fans.', '体育场里满是粉丝。'),
  w('coach', '教练', '/koʊtʃ/', '🧑‍🏫', 'Our coach trains us hard.', '我们的教练严格训练我们。'),
  w('compete', '竞争', '/kəmˈpiːt/', '🏃', 'We compete in the race.', '我们在比赛中竞争。'),
], '🏆')
const L4_U8 = unit('L4', 8, '奇妙发明', 'Amazing Inventions', [
  w('invention', '发明', '/ɪnˈvenʃn/', '💡', 'The light bulb is a great invention.', '灯泡是一个伟大的发明。'),
  w('inventor', '发明家', '/ɪnˈventər/', '🧑‍🔬', 'Edison is a famous inventor.', '爱迪生是一位著名的发明家。'),
  w('technology', '科技', '/tekˈnɑːlədʒi/', '💻', 'Technology changes our lives.', '科技改变了我们的生活。'),
  w('device', '装置', '/dɪˈvaɪs/', '📱', 'This device can measure temperature.', '这个装置可以测量温度。'),
  w('gadget', '小玩意', '/ˈɡædʒɪt/', '⌚', 'I like new gadgets.', '我喜欢新奇的小玩意。'),
  w('battery', '电池', '/ˈbætəri/', '🔋', 'The battery is low.', '电池电量低。'),
  w('solar power', '太阳能', '/ˈsoʊlər ˈpaʊər/', '☀️', 'This car uses solar power.', '这辆车使用太阳能。'),
  w('wireless', '无线的', '/ˈwaɪərləs/', '📶', 'My headphones are wireless.', '我的耳机是无线的。'),
  w('automatic', '自动的', '/ˌɔːtəˈmætɪk/', '⚙️', 'The door is automatic.', '这门是自动的。'),
  w('upgrade', '升级', '/ˈʌpɡreɪd/', '⬆️', 'I upgrade my phone.', '我升级了我的手机。'),
  w('app', '应用程序', '/æp/', '📱', 'I download a new app.', '我下载了一个新应用。'),
], '💡')
const L4_U9 = unit('L4', 9, '未来世界（复习）', 'Future World', [
  w('future', '未来', '/ˈfjuːtʃər/', '🔮', 'I think about the future.', '我思考未来。'),
  w('imagine', '想象', '/ɪˈmædʒɪn/', '💭', 'Imagine a flying car.', '想象一下飞行汽车。'),
  w('predict', '预测', '/prɪˈdɪkt/', '🔮', 'Scientists predict the weather.', '科学家预测天气。'),
  w('artificial intelligence', '人工智能', '/ˌɑːrtɪˈfɪʃl ɪnˈtelɪdʒəns/', '🤖', 'AI helps us every day.', '人工智能每天帮助我们。'),
  w('virtual reality', '虚拟现实', '/ˈvɜːrtʃuəl riˈæləti/', '🥽', 'I try virtual reality games.', '我尝试虚拟现实游戏。'),
  w('smart home', '智能家居', '/smɑːrt hoʊm/', '🏠', 'We have a smart home.', '我们有一个智能家居。'),
  w('self-driving car', '自动驾驶汽车', '/self ˈdraɪvɪŋ kɑːr/', '🚗', 'The self-driving car drives itself.', '自动驾驶汽车自己行驶。'),
  w('clone', '克隆', '/kloʊn/', '🧬', 'Scientists clone a sheep.', '科学家克隆了一只羊。'),
  w('hologram', '全息图', '/ˈhɑːləɡræm/', '👻', 'The hologram looks real.', '全息图看起来很真实。'),
  w('spaceship', '宇宙飞船', '/ˈspeɪsʃɪp/', '🛸', 'The spaceship travels to Mars.', '宇宙飞船飞往火星。'),
  w('innovation', '创新', '/ˌɪnəˈveɪʃn/', '💡', 'Innovation makes life better.', '创新让生活更美好。'),
], '🔮')

export const L4_UNITS: UnitData[] = [
  L4_U1, L4_U2, L4_U3, L4_U4, L4_U5, L4_U6, L4_U7, L4_U8, L4_U9,
]
