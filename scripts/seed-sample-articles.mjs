// 뉴스 API / Claude API 키 없이도 화면을 바로 테스트할 수 있도록
// 원본 예시 스토리를 DB에 넣어주는 스크립트입니다.
// 실행: node scripts/seed-sample-articles.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SAMPLE_ARTICLES = [
  {
    level: "ELEMENTARY",
    category: "culture",
    title: "Korean Kids Celebrate Chuseok Together",
    sentences: [
      { en: "Chuseok is a big holiday in Korea.", ko: "추석은 한국의 큰 명절이에요." },
      { en: "Families come together to eat rice cakes.", ko: "가족들이 모여서 송편을 먹어요." },
      { en: "They wear colorful clothes called hanbok.", ko: "알록달록한 한복을 입어요." },
      { en: "Kids play fun outdoor games.", ko: "아이들은 재미있는 야외 놀이를 해요." },
      { en: "Everyone says thank you for the harvest.", ko: "모두 풍성한 수확에 감사해요." },
      { en: "It is a happy time for families.", ko: "가족에게 행복한 시간이에요." },
    ],
    vocabulary: [
      { word: "holiday", meaning: "명절, 휴일" },
      { word: "harvest", meaning: "수확" },
      { word: "colorful", meaning: "알록달록한" },
      { word: "together", meaning: "함께" },
      { word: "outdoor", meaning: "야외의" },
    ],
  },
  {
    level: "ELEMENTARY",
    category: "kpop",
    title: "A Young Band Practices Every Day",
    sentences: [
      { en: "A group of kids started a small band.", ko: "아이들이 작은 밴드를 만들었어요." },
      { en: "They practice singing after school.", ko: "방과 후에 노래 연습을 해요." },
      { en: "Every member has a special job.", ko: "멤버마다 특별한 역할이 있어요." },
      { en: "One girl writes short, fun songs.", ko: "한 소녀는 짧고 재미있는 노래를 써요." },
      { en: "They dance together in the practice room.", ko: "다같이 연습실에서 춤을 춰요." },
      { en: "Their music makes everyone smile.", ko: "그들의 음악은 모두를 웃게 해요." },
    ],
    vocabulary: [
      { word: "band", meaning: "밴드, 악단" },
      { word: "practice", meaning: "연습하다" },
      { word: "member", meaning: "멤버, 구성원" },
      { word: "dance", meaning: "춤추다" },
      { word: "smile", meaning: "미소 짓다" },
    ],
  },
  {
    level: "ELEMENTARY",
    category: "kart",
    title: "A Boy Paints His Own K-Art Mural",
    sentences: [
      { en: "A boy loves to paint big pictures.", ko: "한 소년은 큰 그림 그리기를 좋아해요." },
      { en: "He paints on a wall near his school.", ko: "학교 근처 벽에 그림을 그려요." },
      { en: "His art shows tigers and flowers.", ko: "그의 그림에는 호랑이와 꽃이 있어요." },
      { en: "Many people stop and look at it.", ko: "많은 사람들이 멈춰서 구경해요." },
      { en: "The colors are bright and happy.", ko: "색깔이 밝고 즐거워요." },
      { en: "His teacher says he is very talented.", ko: "선생님은 그가 아주 재능있다고 말해요." },
    ],
    vocabulary: [
      { word: "paint", meaning: "그리다, 페인트칠하다" },
      { word: "wall", meaning: "벽" },
      { word: "bright", meaning: "밝은" },
      { word: "talented", meaning: "재능있는" },
      { word: "picture", meaning: "그림" },
    ],
  },
  {
    level: "ELEMENTARY",
    category: "literature",
    title: "A Girl Writes Her First Story Book",
    sentences: [
      { en: "A young girl loves to write stories.", ko: "한 소녀는 이야기 쓰기를 좋아해요." },
      { en: "She made a small book about a rabbit.", ko: "토끼에 관한 작은 책을 만들었어요." },
      { en: "The rabbit looks for a lost friend.", ko: "그 토끼는 잃어버린 친구를 찾아요." },
      { en: "Her classmates love reading her book.", ko: "반 친구들이 그 책 읽기를 좋아해요." },
      { en: "She reads it out loud in class.", ko: "그녀는 수업 시간에 크게 읽어줘요." },
      { en: "Everyone claps at the end.", ko: "모두 마지막에 박수를 쳐요." },
    ],
    vocabulary: [
      { word: "story", meaning: "이야기" },
      { word: "lost", meaning: "잃어버린" },
      { word: "classmate", meaning: "반 친구" },
      { word: "read", meaning: "읽다" },
      { word: "clap", meaning: "박수치다" },
    ],
  },
  {
    level: "ELEMENTARY",
    category: "quotes",
    title: "A Simple Saying About Trying Again",
    sentences: [
      { en: "There is a saying kids like a lot.", ko: "아이들이 좋아하는 명언이 있어요." },
      { en: "It says, 'Try, try again.'", ko: "'다시, 또 다시 해보라'는 말이에요." },
      { en: "It means do not give up too fast.", ko: "너무 빨리 포기하지 말라는 뜻이에요." },
      { en: "A small boy used this saying at soccer practice.", ko: "한 소년이 축구 연습에서 이 말을 썼어요." },
      { en: "He fell down many times.", ko: "여러 번 넘어졌어요." },
      { en: "In the end, he learned to run fast.", ko: "결국 그는 빨리 달리는 법을 배웠어요." },
    ],
    vocabulary: [
      { word: "saying", meaning: "명언, 속담" },
      { word: "try", meaning: "시도하다" },
      { word: "give up", meaning: "포기하다" },
      { word: "fall down", meaning: "넘어지다" },
      { word: "learn", meaning: "배우다" },
    ],
  },
  {
    level: "ELEMENTARY",
    category: "heroes",
    title: "A Kind Doctor Who Helped Many People",
    sentences: [
      { en: "Long ago, a doctor helped poor people for free.", ko: "옛날에 한 의사가 가난한 사람들을 무료로 도왔어요." },
      { en: "She traveled to small villages.", ko: "작은 마을들을 다녔어요." },
      { en: "She carried medicine in a big bag.", ko: "큰 가방에 약을 넣고 다녔어요." },
      { en: "Many sick people became healthy again.", ko: "많은 아픈 사람들이 다시 건강해졌어요." },
      { en: "Children still learn her name at school.", ko: "아이들은 아직도 학교에서 그녀의 이름을 배워요." },
      { en: "She is remembered as a hero.", ko: "그녀는 영웅으로 기억돼요." },
    ],
    vocabulary: [
      { word: "doctor", meaning: "의사" },
      { word: "village", meaning: "마을" },
      { word: "medicine", meaning: "약" },
      { word: "healthy", meaning: "건강한" },
      { word: "hero", meaning: "영웅" },
    ],
  },
  {
    level: "MIDDLE",
    category: "culture",
    title: "Students Learn Traditional Korean Dance",
    sentences: [
      { en: "A middle school recently added a traditional Korean dance class.", ko: "한 중학교가 최근 전통 한국 무용 수업을 새로 만들었어요." },
      { en: "Students learn movements that have been passed down for hundreds of years.", ko: "학생들은 수백 년 동안 전해 내려온 동작을 배워요." },
      { en: "The dance uses long fan-shaped sleeves called hanbok sleeves.", ko: "이 춤은 한복 소매처럼 긴 소매를 사용해요." },
      { en: "At first, many students found the steps difficult to remember.", ko: "처음에는 많은 학생들이 동작을 외우기 어려워했어요." },
      { en: "After weeks of practice, the class performed at a school festival.", ko: "몇 주간 연습한 후, 학교 축제에서 공연을 했어요." },
      { en: "Parents were amazed by how graceful the students looked.", ko: "부모님들은 학생들의 우아한 모습에 놀랐어요." },
      { en: "The teacher says the class helps students appreciate their own culture.", ko: "선생님은 이 수업이 학생들에게 자신의 문화를 이해하는 데 도움이 된다고 말해요." },
      { en: "Several students now want to continue learning traditional dance outside of school.", ko: "몇몇 학생들은 학교 밖에서도 전통 무용을 계속 배우고 싶어해요." },
    ],
    vocabulary: [
      { word: "traditional", meaning: "전통적인" },
      { word: "movement", meaning: "동작" },
      { word: "graceful", meaning: "우아한" },
      { word: "appreciate", meaning: "이해하다, 감사하다" },
      { word: "perform", meaning: "공연하다" },
    ],
  },
  {
    level: "MIDDLE",
    category: "kpop",
    title: "A School Club Writes Its Own K-Pop Song",
    sentences: [
      { en: "A group of students at a local middle school decided to write and record their own K-pop style song.", ko: "한 중학교의 학생 동아리가 자신들만의 K-pop 스타일 노래를 쓰고 녹음하기로 했어요." },
      { en: "They spent several months writing lyrics about friendship and growing up.", ko: "몇 달 동안 우정과 성장에 관한 가사를 썼어요." },
      { en: "One student composed the melody using a simple music app.", ko: "한 학생은 간단한 음악 앱으로 멜로디를 작곡했어요." },
      { en: "Another student, who loves dancing, created the choreography for the chorus.", ko: "춤을 좋아하는 다른 학생은 후렴구 안무를 만들었어요." },
      { en: "The club performed the song at the school's talent show in front of hundreds of students.", ko: "동아리는 수백 명의 학생들 앞에서 학교 장기자랑 때 이 노래를 공연했어요." },
      { en: "The audience cheered loudly and asked for an encore.", ko: "관객들은 크게 환호하며 앙코르를 요청했어요." },
      { en: "The club's teacher says the project taught students about teamwork as much as music.", ko: "담당 선생님은 이 프로젝트가 음악만큼이나 팀워크도 가르쳐줬다고 말해요." },
      { en: "The song is now the most requested video on the school's online channel.", ko: "이 노래는 지금 학교 온라인 채널에서 가장 많이 요청받는 영상이에요." },
    ],
    vocabulary: [
      { word: "lyrics", meaning: "가사" },
      { word: "compose", meaning: "작곡하다" },
      { word: "choreography", meaning: "안무" },
      { word: "audience", meaning: "관객" },
      { word: "encore", meaning: "앙코르" },
    ],
  },
  {
    level: "MIDDLE",
    category: "kart",
    title: "A Teen Artist Blends Traditional and Modern Styles",
    sentences: [
      { en: "A fourteen-year-old artist has become known at her school for mixing traditional Korean painting with modern digital art.", ko: "열네 살의 한 예술가는 전통 한국화와 현대 디지털 아트를 섞은 작품으로 학교에서 유명해졌어요." },
      { en: "She first learned ink painting from her grandmother, who taught her how to paint mountains and flowers.", ko: "그녀는 할머니에게서 먼저 산과 꽃을 그리는 수묵화를 배웠어요." },
      { en: "Later, she started using a tablet to add bright, modern colors to her traditional drawings.", ko: "나중에는 태블릿을 사용해서 전통 그림에 밝고 현대적인 색을 더하기 시작했어요." },
      { en: "Her unique style caught the attention of a local art teacher, who invited her to display work in a small gallery.", ko: "그녀의 독특한 스타일은 지역 미술 선생님의 눈에 띄었고, 작은 갤러리에 작품을 전시하도록 초대받았어요." },
      { en: "Visitors said her paintings felt both old and new at the same time.", ko: "방문객들은 그녀의 그림이 옛것이면서 동시에 새로운 느낌이라고 말했어요." },
      { en: "The young artist says she wants to keep exploring new ways to combine the two styles.", ko: "어린 예술가는 두 스타일을 결합하는 새로운 방법을 계속 탐구하고 싶다고 말해요." },
      { en: "She hopes more students will try mixing traditions with modern tools.", ko: "그녀는 더 많은 학생들이 전통과 현대 도구를 섞어보길 바라요." },
    ],
    vocabulary: [
      { word: "traditional", meaning: "전통적인" },
      { word: "digital", meaning: "디지털의" },
      { word: "unique", meaning: "독특한" },
      { word: "gallery", meaning: "갤러리, 화랑" },
      { word: "combine", meaning: "결합하다" },
    ],
  },
  {
    level: "MIDDLE",
    category: "literature",
    title: "A Reading Club Brings Classic Stories to Life",
    sentences: [
      { en: "A middle school reading club recently decided to turn a classic Korean folk tale into a short stage play.", ko: "한 중학교 독서 동아리가 최근 한국 전래동화를 짧은 연극으로 만들기로 했어요." },
      { en: "Students took turns writing scenes, designing costumes, and building simple sets from cardboard.", ko: "학생들은 돌아가며 장면을 쓰고, 의상을 디자인하고, 골판지로 간단한 무대 세트를 만들었어요." },
      { en: "The story followed a clever character who outsmarts a group of greedy animals.", ko: "이야기는 욕심 많은 동물들을 속이는 영리한 캐릭터를 따라갔어요." },
      { en: "Rehearsals took place twice a week for over a month before the final performance.", ko: "최종 공연 전까지 한 달 넘게 일주일에 두 번 연습했어요." },
      { en: "On the day of the show, the auditorium was full of excited parents and classmates.", ko: "공연 날, 강당은 신난 부모님들과 친구들로 가득 찼어요." },
      { en: "The young actors said memorizing lines was harder than they expected, but very rewarding.", ko: "어린 배우들은 대사를 외우는 게 생각보다 어려웠지만 아주 보람있었다고 말했어요." },
      { en: "Teachers hope the project will encourage more students to read classic literature.", ko: "선생님들은 이 프로젝트가 더 많은 학생들이 고전 문학을 읽도록 이끌기를 바라요." },
      { en: "The club is already planning its next story for the following semester.", ko: "동아리는 벌써 다음 학기 이야기를 계획하고 있어요." },
    ],
    vocabulary: [
      { word: "classic", meaning: "고전의" },
      { word: "rehearsal", meaning: "리허설, 예행연습" },
      { word: "memorize", meaning: "암기하다" },
      { word: "rewarding", meaning: "보람있는" },
      { word: "auditorium", meaning: "강당" },
    ],
  },
  {
    level: "MIDDLE",
    category: "quotes",
    title: "A Class Collects Sayings from Around the World",
    sentences: [
      { en: "A middle school English class started a project collecting famous sayings from different countries.", ko: "한 중학교 영어 수업에서 여러 나라의 유명한 명언을 모으는 프로젝트를 시작했어요." },
      { en: "Each student researched one quote and explained what it meant in their own words.", ko: "각 학생은 명언을 하나씩 조사하고 자기 말로 그 의미를 설명했어요." },
      { en: "One student shared a Korean proverb about patience, comparing it to a similar saying from Japan.", ko: "한 학생은 인내에 관한 한국 속담을 소개하며 일본의 비슷한 속담과 비교했어요." },
      { en: "Another found an African proverb about teamwork that surprised the whole class.", ko: "다른 학생은 반 전체를 놀라게 한 팀워크에 관한 아프리카 속담을 찾았어요." },
      { en: "The teacher displayed all the quotes on a large classroom wall for everyone to read.", ko: "선생님은 모든 명언을 교실 큰 벽에 붙여 모두가 읽을 수 있게 했어요." },
      { en: "Students said the project helped them realize that many cultures share similar values.", ko: "학생들은 이 프로젝트 덕분에 여러 문화가 비슷한 가치를 공유한다는 것을 깨달았다고 말했어요." },
      { en: "Some quotes became so popular that students started using them in daily conversation.", ko: "몇몇 명언은 인기가 많아져서 학생들이 일상 대화에서 사용하기 시작했어요." },
      { en: "The class plans to add new sayings every month throughout the school year.", ko: "학급은 한 해 동안 매달 새 명언을 추가할 계획이에요." },
    ],
    vocabulary: [
      { word: "proverb", meaning: "속담" },
      { word: "patience", meaning: "인내" },
      { word: "compare", meaning: "비교하다" },
      { word: "value", meaning: "가치" },
      { word: "research", meaning: "조사하다" },
    ],
  },
  {
    level: "MIDDLE",
    category: "heroes",
    title: "The Scientist Who Never Stopped Asking Questions",
    sentences: [
      { en: "A famous scientist grew up in a small town where few students went on to study science.", ko: "한 유명한 과학자는 과학을 공부하러 가는 학생이 거의 없는 작은 마을에서 자랐어요." },
      { en: "As a child, she constantly asked her teachers questions that no one could answer.", ko: "어릴 때, 그녀는 선생님들에게 아무도 답할 수 없는 질문을 계속했어요." },
      { en: "Instead of giving up, she started reading every science book she could find at the library.", ko: "포기하는 대신, 그녀는 도서관에서 찾을 수 있는 모든 과학책을 읽기 시작했어요." },
      { en: "Years later, she made an important discovery that helped doctors treat a serious disease.", ko: "몇 년 후, 그녀는 의사들이 심각한 질병을 치료하는 데 도움이 된 중요한 발견을 했어요." },
      { en: "Many people said her success came from luck, but she always credited her endless curiosity.", ko: "많은 사람들이 그녀의 성공이 운이라고 말했지만, 그녀는 항상 자신의 끝없는 호기심 덕분이라고 말했어요." },
      { en: "She now visits schools to encourage students to keep asking questions, even difficult ones.", ko: "그녀는 이제 학생들이 어려운 질문이라도 계속하도록 격려하기 위해 학교를 방문해요." },
      { en: "Her story reminds young readers that curiosity can lead to great achievements.", ko: "그녀의 이야기는 어린 독자들에게 호기심이 위대한 성취로 이어질 수 있음을 알려줘요." },
      { en: "Today, a science award for young students is named in her honor.", ko: "오늘날, 어린 학생들을 위한 과학상이 그녀의 이름을 따서 지어졌어요." },
    ],
    vocabulary: [
      { word: "discovery", meaning: "발견" },
      { word: "curiosity", meaning: "호기심" },
      { word: "achievement", meaning: "성취" },
      { word: "credit", meaning: "공로를 인정하다" },
      { word: "honor", meaning: "기리다, 영예" },
    ],
  },
  {
    level: "JUNIOR",
    category: "culture",
    title: "How a Village Festival Became a National Tradition",
    sentences: [
      { en: "What began as a small local celebration in one Korean village has grown into a nationally recognized cultural festival attended by thousands each year.", ko: "한 한국 마을에서 작은 지역 축제로 시작된 행사가 이제는 매년 수천 명이 찾는 전국적으로 인정받는 문화 축제로 성장했어요." },
      { en: "Historians say the festival originally marked the end of the harvest season, when farmers gave thanks and shared food with their neighbors.", ko: "역사학자들은 이 축제가 원래 수확철이 끝날 때 농부들이 감사를 표하고 이웃과 음식을 나누던 것에서 시작됐다고 말해요." },
      { en: "Over the decades, the event expanded to include traditional music, mask dances, and storytelling performances passed down through generations.", ko: "수십 년에 걸쳐, 이 행사는 전통 음악, 탈춤, 그리고 세대를 거쳐 전해진 이야기 공연을 포함하도록 확장됐어요." },
      { en: "Local organizers have worked carefully to preserve original customs while also making the festival accessible to younger visitors unfamiliar with the traditions.", ko: "지역 주최자들은 원래의 풍습을 지키면서도, 전통에 익숙하지 않은 젊은 방문객들도 즐길 수 있도록 세심하게 노력해왔어요." },
      { en: "Recently, the festival added interactive workshops where children can try wearing traditional clothing and playing folk instruments themselves.", ko: "최근에는 아이들이 직접 전통 의상을 입어보고 민속 악기를 연주해볼 수 있는 체험 워크숍도 추가됐어요." },
      { en: "Cultural experts argue that festivals like this play an important role in helping younger generations connect with their heritage.", ko: "문화 전문가들은 이런 축제가 젊은 세대가 자신들의 유산과 연결되도록 돕는 중요한 역할을 한다고 주장해요." },
      { en: "Attendance has grown by nearly forty percent over the past five years, according to local tourism officials.", ko: "지역 관광 관계자에 따르면 지난 5년간 방문객 수가 거의 40퍼센트 증가했어요." },
      { en: "Organizers hope the festival will continue evolving without losing the values that made it meaningful in the first place.", ko: "주최자들은 이 축제가 처음 의미있었던 가치를 잃지 않으면서 계속 발전하기를 바라요." },
    ],
    vocabulary: [
      { word: "heritage", meaning: "유산" },
      { word: "preserve", meaning: "보존하다" },
      { word: "generation", meaning: "세대" },
      { word: "custom", meaning: "풍습" },
      { word: "accessible", meaning: "접근하기 쉬운" },
    ],
  },
  {
    level: "JUNIOR",
    category: "kpop",
    title: "The Global Rise of K-Pop Choreography",
    sentences: [
      { en: "Over the past decade, K-pop's tightly synchronized choreography has become one of the genre's most recognizable and widely imitated features around the world.", ko: "지난 10년 동안, K-pop의 정교하게 맞춰진 안무는 전 세계에서 가장 알아보기 쉽고 널리 모방되는 장르의 특징 중 하나가 됐어요." },
      { en: "Dance instructors say the intense training schedules that trainees follow, sometimes for years before debuting, are largely responsible for the precision seen in performances.", ko: "댄스 강사들은 데뷔 전 몇 년간 이어지는 연습생들의 강도 높은 훈련 일정이 공연에서 보이는 정확성의 주된 이유라고 말해요." },
      { en: "Increasingly, choreographers blend elements of hip-hop, contemporary dance, and traditional movement into routines designed to complement each song's storyline.", ko: "안무가들은 점점 더 힙합, 현대무용, 전통 동작의 요소를 섞어서 각 곡의 스토리라인을 보완하는 루틴을 만들고 있어요." },
      { en: "Social media has played a significant role in the trend's global spread, as fans learn and recreate dance routines in short videos shared across platforms.", ko: "소셜 미디어는 팬들이 짧은 영상으로 춤 루틴을 배우고 재현해 여러 플랫폼에 공유하면서 이 트렌드가 전 세계로 퍼지는 데 큰 역할을 했어요." },
      { en: "Dance academies in cities far from Korea have reported a sharp increase in students specifically requesting K-pop style classes.", ko: "한국에서 먼 도시의 댄스 학원들은 K-pop 스타일 수업을 특별히 요청하는 학생들이 크게 늘었다고 보고했어요." },
      { en: "Some choreographers argue that the genre's influence has begun reshaping mainstream pop performances internationally, not just among Korean artists.", ko: "몇몇 안무가들은 이 장르의 영향력이 한국 아티스트뿐 아니라 국제적으로 주류 팝 공연의 형태까지 바꾸기 시작했다고 주장해요." },
      { en: "Critics note that behind the polished performances lies a demanding rehearsal culture that raises ongoing questions about trainee well-being.", ko: "비평가들은 세련된 공연 뒤에는 연습생의 복지에 관한 지속적인 문제 제기를 낳는 힘든 연습 문화가 있다고 지적해요." },
      { en: "Despite these debates, industry analysts expect K-pop choreography to remain a defining feature of the genre's global appeal for years to come.", ko: "이런 논쟁에도 불구하고, 업계 분석가들은 K-pop 안무가 앞으로도 이 장르의 세계적인 매력을 결정짓는 요소로 남을 것이라고 예상해요." },
    ],
    vocabulary: [
      { word: "synchronized", meaning: "동시에 맞춰진" },
      { word: "choreographer", meaning: "안무가" },
      { word: "trainee", meaning: "연습생" },
      { word: "mainstream", meaning: "주류의" },
      { word: "well-being", meaning: "복지, 안녕" },
    ],
  },
  {
    level: "JUNIOR",
    category: "kart",
    title: "Digital Tools Are Reshaping Traditional Korean Painting",
    sentences: [
      { en: "A growing number of young Korean artists are using digital tools to reinterpret traditional painting techniques that date back centuries.", ko: "점점 더 많은 젊은 한국 예술가들이 디지털 도구를 사용해 수백 년 전으로 거슬러 올라가는 전통 회화 기법을 새롭게 해석하고 있어요." },
      { en: "Rather than replacing brushes and ink entirely, many artists use tablets alongside traditional materials, scanning hand-painted elements and enhancing them digitally afterward.", ko: "붓과 먹을 완전히 대체하기보다는, 많은 예술가들이 손으로 그린 요소를 스캔한 뒤 디지털로 보완하면서 전통 재료와 태블릿을 함께 사용해요." },
      { en: "Art historians note that this hybrid approach allows younger artists to experiment more freely without the fear of ruining expensive traditional materials.", ko: "미술 역사학자들은 이런 혼합 방식이 값비싼 전통 재료를 망칠 걱정 없이 젊은 예술가들이 더 자유롭게 실험할 수 있게 해준다고 말해요." },
      { en: "Several major galleries have begun dedicating exhibition space specifically to artists working in this blended style, a decision that would have seemed unlikely just a decade ago.", ko: "몇몇 주요 갤러리들은 이런 혼합 스타일로 작업하는 예술가들을 위한 전시 공간을 따로 마련하기 시작했는데, 이는 불과 10년 전만 해도 있을 법하지 않은 결정이었어요." },
      { en: "Some traditionalists worry that digital techniques may eventually overshadow the discipline required to master ink painting by hand.", ko: "일부 전통주의자들은 디지털 기법이 결국 손으로 수묵화를 완성하는 데 필요한 훈련을 가리게 될까 걱정해요." },
      { en: "Supporters counter that digital tools are simply new instruments, no different from how earlier generations adapted foreign materials into Korean art.", ko: "지지자들은 디지털 도구가 단지 새로운 도구일 뿐이며, 이전 세대가 외국 재료를 한국 미술에 받아들였던 것과 다르지 않다고 반박해요." },
      { en: "Universities have started offering courses that teach both classical brush techniques and digital illustration side by side.", ko: "대학들은 고전 붓 기법과 디지털 일러스트를 나란히 가르치는 강좌를 개설하기 시작했어요." },
      { en: "As the debate continues, most agree that this movement reflects a broader effort to keep traditional art relevant to a new generation.", ko: "논쟁이 계속되는 가운데, 대부분은 이 흐름이 전통 예술을 새로운 세대에게 의미있게 유지하려는 더 큰 노력을 반영한다는 데 동의해요." },
    ],
    vocabulary: [
      { word: "reinterpret", meaning: "재해석하다" },
      { word: "hybrid", meaning: "혼합의" },
      { word: "exhibition", meaning: "전시" },
      { word: "traditionalist", meaning: "전통주의자" },
      { word: "discipline", meaning: "훈련, 수양" },
    ],
  },
  {
    level: "JUNIOR",
    category: "literature",
    title: "Why Korean Classic Novels Are Finding New Readers",
    sentences: [
      { en: "Sales of classic Korean literature have seen a noticeable rise among teenagers in recent years, a trend that publishers say was unexpected given increasing competition from digital entertainment.", ko: "최근 몇 년간 청소년들 사이에서 한국 고전 문학 판매가 눈에 띄게 늘었는데, 출판사들은 디지털 오락과의 경쟁이 심해지는 상황에서 예상치 못한 흐름이라고 말해요." },
      { en: "Several publishing houses have released updated editions with modern illustrations and simplified footnotes designed to make older texts more approachable for younger readers.", ko: "여러 출판사들이 현대적인 삽화와 간단한 각주를 더한 개정판을 내놓아 오래된 글을 젊은 독자들이 더 쉽게 접근할 수 있도록 했어요." },
      { en: "Some educators credit social media, where short video clips discussing classic novels have unexpectedly gone viral among students.", ko: "일부 교육자들은 고전 소설을 다루는 짧은 영상이 학생들 사이에서 예상치 못하게 화제가 된 소셜 미디어를 그 이유로 꼽아요." },
      { en: "A number of schools have also redesigned their literature curriculum to connect classic stories with themes students find personally relevant, such as identity and social pressure.", ko: "몇몇 학교들은 정체성과 사회적 압박처럼 학생들이 개인적으로 공감할 수 있는 주제와 고전 이야기를 연결하도록 문학 교육과정을 다시 짰어요." },
      { en: "Authors of these classic works often explored questions about justice and family duty that, according to teachers, still resonate strongly with today's students.", ko: "이런 고전 작품의 작가들은 정의와 가족의 의무에 관한 질문을 자주 탐구했는데, 선생님들에 따르면 이는 오늘날 학생들에게도 여전히 강하게 와닿는다고 해요." },
      { en: "Book clubs focused specifically on classic literature have started forming in several middle and high schools.", ko: "고전 문학만을 다루는 독서 동아리가 여러 중고등학교에서 생기기 시작했어요." },
      { en: "Publishers note that while sales of traditional print books have generally declined, this particular category has bucked the trend.", ko: "출판사들은 전통 종이책 판매가 전반적으로 줄어드는 가운데도 이 분야만은 그 흐름을 거스르고 있다고 말해요." },
      { en: "Industry watchers believe the renewed interest reflects a broader desire among young readers to understand their own cultural roots more deeply.", ko: "업계 관찰자들은 이런 관심의 부활이 자신들의 문화적 뿌리를 더 깊이 이해하고 싶어하는 젊은 독자들의 더 넓은 바람을 반영한다고 믿어요." },
    ],
    vocabulary: [
      { word: "publisher", meaning: "출판사" },
      { word: "approachable", meaning: "다가가기 쉬운" },
      { word: "curriculum", meaning: "교육과정" },
      { word: "resonate", meaning: "공감을 불러일으키다" },
      { word: "identity", meaning: "정체성" },
    ],
  },
  {
    level: "JUNIOR",
    category: "quotes",
    title: "The Story Behind a Quote That Inspired a Generation",
    sentences: [
      { en: "Few people who repeat the famous saying 'fall seven times, stand up eight' realize how deeply rooted it is in centuries of Korean and East Asian philosophy about resilience.", ko: "'일곱 번 넘어져도 여덟 번 일어난다'는 유명한 명언을 되뇌는 사람들 중 이 말이 회복력에 관한 수 세기에 걸친 한국과 동아시아 철학에 얼마나 깊이 뿌리내리고 있는지 아는 사람은 많지 않아요." },
      { en: "Historians trace early versions of the phrase to reflections on perseverance found in classical texts studied by scholars generations ago.", ko: "역사학자들은 이 표현의 초기 형태를 여러 세대 전 학자들이 공부했던 고전 문헌 속 인내에 관한 성찰에서 찾아내요." },
      { en: "The quote gained renewed popularity in modern Korea after athletes and public figures began referencing it during interviews about overcoming setbacks.", ko: "이 명언은 운동선수나 유명 인사들이 어려움을 극복한 이야기를 인터뷰에서 언급하면서 현대 한국에서 다시 인기를 얻었어요." },
      { en: "Psychologists studying motivation say short, memorable phrases like this one can have a measurable effect on how people respond to failure.", ko: "동기부여를 연구하는 심리학자들은 이런 짧고 기억하기 쉬운 문구가 사람들이 실패에 반응하는 방식에 측정 가능한 영향을 줄 수 있다고 말해요." },
      { en: "Teachers increasingly use the quote in classrooms, not simply as decoration on a wall, but as a starting point for discussions about resilience and effort.", ko: "선생님들은 이 명언을 벽에 붙이는 장식으로만이 아니라, 회복력과 노력에 관한 토론의 출발점으로 점점 더 많이 사용하고 있어요." },
      { en: "Some scholars caution against oversimplifying the phrase, noting that its original context emphasized patience and self-reflection rather than blind persistence.", ko: "일부 학자들은 이 문구의 원래 맥락이 맹목적인 끈기보다는 인내와 자기 성찰을 강조했다며, 지나친 단순화를 경계해요." },
      { en: "Despite differing interpretations, the quote continues to appear in everything from sports documentaries to graduation speeches.", ko: "서로 다른 해석에도 불구하고, 이 명언은 스포츠 다큐멘터리부터 졸업 연설까지 계속 등장해요." },
      { en: "Its endurance, experts argue, comes from the way it distills a complex philosophy into a message anyone can understand within seconds.", ko: "전문가들은 이 명언이 지속되는 이유가 복잡한 철학을 누구나 몇 초 안에 이해할 수 있는 메시지로 압축했기 때문이라고 말해요." },
    ],
    vocabulary: [
      { word: "resilience", meaning: "회복력" },
      { word: "perseverance", meaning: "인내, 끈기" },
      { word: "setback", meaning: "좌절, 어려움" },
      { word: "oversimplify", meaning: "지나치게 단순화하다" },
      { word: "distill", meaning: "압축하다, 정제하다" },
    ],
  },
  {
    level: "JUNIOR",
    category: "heroes",
    title: "The Engineer Who Redesigned Disaster Relief",
    sentences: [
      { en: "After witnessing the aftermath of a major earthquake as a young volunteer, one engineer dedicated much of her career to designing shelters that could be built faster and more safely than traditional emergency housing.", ko: "젊은 자원봉사자로 대지진의 참혹한 여파를 직접 본 뒤, 한 엔지니어는 자신의 경력 대부분을 전통적인 재난 주택보다 더 빠르고 안전하게 지을 수 있는 대피소를 설계하는 데 바쳤어요." },
      { en: "Her early designs were repeatedly rejected by funding organizations who doubted that low-cost materials could withstand harsh conditions.", ko: "그녀의 초기 설계는 저비용 재료가 혹독한 환경을 견딜 수 있을지 의심하는 자금 지원 단체들에 의해 계속 거절당했어요." },
      { en: "Rather than abandoning the project, she spent years testing prototypes in a small workshop, often funding the work herself.", ko: "프로젝트를 포기하는 대신, 그녀는 작은 작업실에서 몇 년 동안 시제품을 시험했고, 종종 자비로 그 작업에 자금을 댔어요." },
      { en: "Her breakthrough came when she developed a foldable shelter that could be assembled by untrained volunteers in under an hour.", ko: "그녀의 돌파구는 훈련받지 않은 자원봉사자들도 한 시간 안에 조립할 수 있는 접이식 대피소를 개발했을 때 찾아왔어요." },
      { en: "Aid organizations that once dismissed her ideas eventually adopted her designs after successful trials during a regional flooding crisis.", ko: "한때 그녀의 아이디어를 무시했던 구호 단체들은 지역 홍수 위기 때의 성공적인 시험 이후 결국 그녀의 설계를 채택했어요." },
      { en: "Engineers who have studied her work say her greatest contribution was proving that affordability and safety did not have to be conflicting goals.", ko: "그녀의 작업을 연구한 엔지니어들은 그녀의 가장 큰 공헌이 저렴함과 안전성이 서로 상충하는 목표가 아님을 증명한 것이라고 말해요." },
      { en: "She has since trained hundreds of young engineers in disaster-response design, many of whom now lead their own humanitarian projects.", ko: "그 이후로 그녀는 수백 명의 젊은 엔지니어들을 재난 대응 설계 분야에서 훈련시켰고, 그중 많은 이들이 이제 자신만의 인도주의 프로젝트를 이끌고 있어요." },
      { en: "Her story is frequently cited in engineering schools as an example of how persistence can eventually reshape an entire field.", ko: "그녀의 이야기는 끈기가 결국 한 분야 전체를 바꿀 수 있다는 예로 공학 학교에서 자주 인용돼요." },
    ],
    vocabulary: [
      { word: "shelter", meaning: "대피소, 보호소" },
      { word: "prototype", meaning: "시제품" },
      { word: "breakthrough", meaning: "돌파구" },
      { word: "humanitarian", meaning: "인도주의의" },
      { word: "persistence", meaning: "끈기" },
    ],
  },
];

// 카테고리를 월드/과학/기술/스포츠 -> 문화/K-pop/K-아트/문학/명언/위인이야기로
// 완전히 교체하면서, 예전 카테고리로 만들어졌던 샘플 스토리는 정리합니다.
const RETIRED_CATEGORIES = ["world", "science", "technology", "sports"];

async function retireOldCategoryArticles() {
  const oldArticles = await prisma.article.findMany({
    where: { category: { in: RETIRED_CATEGORIES } },
    select: { id: true },
  });
  if (oldArticles.length === 0) return;

  const oldIds = oldArticles.map((a) => a.id);
  await prisma.recordingAttempt.deleteMany({
    where: { articleId: { in: oldIds } },
  });
  await prisma.article.deleteMany({ where: { id: { in: oldIds } } });
  console.log(`예전 카테고리 스토리 ${oldIds.length}개를 정리했어요.`);
}

async function main() {
  await retireOldCategoryArticles();

  const existing = await prisma.article.findMany({ select: { title: true } });
  const existingTitles = new Set(existing.map((a) => a.title));
  const toInsert = SAMPLE_ARTICLES.filter((a) => !existingTitles.has(a.title));

  for (const article of toInsert) {
    await prisma.article.create({
      data: {
        level: article.level,
        category: article.category,
        title: article.title,
        script: article.sentences.map((s) => s.en).join(" "),
        sentences: article.sentences,
        vocabulary: article.vocabulary,
        sourceHeadline: article.title,
        sourceUrl: null,
      },
    });
  }
  console.log(
    `${toInsert.length}개의 새 샘플 스토리를 추가했어요. (이미 있던 ${
      SAMPLE_ARTICLES.length - toInsert.length
    }개는 건너뜀)`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
