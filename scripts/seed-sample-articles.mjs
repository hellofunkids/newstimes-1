// 뉴스 API / Claude API 키 없이도 화면을 바로 테스트할 수 있도록
// 원본 예시 스토리 몇 개를 DB에 넣어주는 스크립트입니다.
// 실행: node scripts/seed-sample-articles.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SAMPLE_ARTICLES = [
  {
    level: "ELEMENTARY",
    category: "science",
    title: "A Robot Dog Helps Firefighters",
    script:
      "A robot dog is helping firefighters. The robot dog can walk into smoky rooms. It carries a small camera. The camera sends pictures to the firefighters. This helps them find people faster. Everyone says the robot dog is a good helper.",
    sourceHeadline: "Robot dogs assist fire departments in city trials",
    sourceUrl: null,
  },
  {
    level: "ELEMENTARY",
    category: "sports",
    title: "Kids Plant a Giant School Garden",
    script:
      "Students at a small school started a garden. They planted carrots, tomatoes, and beans. Every morning, the kids water the plants. In the fall, they will share the vegetables. The teacher says the garden makes lunch time more fun.",
    sourceHeadline: "Local school launches student garden program",
    sourceUrl: null,
  },
  {
    level: "MIDDLE",
    category: "science",
    title: "Scientists Discover a Tiny New Frog",
    script:
      "Scientists found a new kind of frog in a rainforest. The frog is smaller than a coin, and it has bright green skin. Researchers say the frog was hiding under wet leaves for a long time. This discovery shows that rainforests still hold many secrets. The team hopes to protect the frog's forest home.",
    sourceHeadline: "Researchers identify new frog species in tropical forest",
    sourceUrl: null,
  },
  {
    level: "MIDDLE",
    category: "technology",
    title: "A School Builds Its Own Weather Station",
    script:
      "A middle school built a weather station on its roof. Students check the temperature, wind, and rain every day. They share the data with the whole town online. The project started as a science class experiment. Now, local farmers use the students' reports to plan their work.",
    sourceHeadline: "Students build weather station for community data",
    sourceUrl: null,
  },
  {
    level: "JUNIOR",
    category: "technology",
    title: "Students Launch a Mini Satellite Project",
    script:
      "A group of high school students designed a small satellite for a science competition. The satellite is about the size of a shoebox, yet it can measure air quality from space. The team spent almost a year testing the device before launch day. Engineers who reviewed the project said the students' work was impressively precise. The success of this project may encourage more schools to start similar space programs.",
    sourceHeadline: "Student engineering team completes satellite prototype",
    sourceUrl: null,
  },
  {
    level: "JUNIOR",
    category: "world",
    title: "A Small Town Becomes a Model for Clean Energy",
    script:
      "A small coastal town recently switched almost entirely to solar and wind power. Residents say their electricity bills have dropped significantly since the change. Local officials worked with engineers for three years to redesign the town's power grid. Visitors from other regions now travel there to study the project. Experts believe this town could become a blueprint for similar communities around the world.",
    sourceHeadline: "Coastal town transitions to renewable energy grid",
    sourceUrl: null,
  },
  {
    level: "ELEMENTARY",
    category: "world",
    title: "A Big Kite Festival by the Sea",
    script:
      "Every spring, a small town holds a kite festival. Families bring colorful kites to the beach. Some kites look like fish and dragons. The wind lifts the kites high into the sky. Kids run and laugh on the sand. Everyone waves at the kites together.",
    sourceHeadline: "Coastal town celebrates its annual kite festival",
    sourceUrl: null,
  },
  {
    level: "ELEMENTARY",
    category: "world",
    title: "A Town Builds a New Playground",
    script:
      "A town built a brand new playground. Kids helped pick the slides and swings. Volunteers worked together for one whole weekend. Now children play there every afternoon. The playground has a small garden too. Everyone is proud of their new space.",
    sourceHeadline: "Volunteers finish new community playground",
    sourceUrl: null,
  },
  {
    level: "ELEMENTARY",
    category: "technology",
    title: "A Talking Toy Helps Kids Learn Words",
    script:
      "A new toy can talk to kids. It says simple words like cat and sun. Children repeat the words back to the toy. The toy claps when they say it right. Many classrooms now use this toy. Kids learn new words every day.",
    sourceHeadline: "Schools try new toy for early vocabulary practice",
    sourceUrl: null,
  },
  {
    level: "ELEMENTARY",
    category: "technology",
    title: "A New App Teaches Kids to Draw",
    script:
      "A new app shows kids how to draw. It gives easy steps for animals and shapes. Kids tap the screen to follow along. The app plays fun music while they draw. Many children finish their first picture in minutes. They feel happy and proud.",
    sourceHeadline: "Drawing app becomes popular with young children",
    sourceUrl: null,
  },
  {
    level: "ELEMENTARY",
    category: "science",
    title: "Ladybugs Help Gardens Grow",
    script:
      "Ladybugs are small but very helpful bugs. They eat tiny pests that harm plants. Farmers like to see ladybugs in their fields. A ladybug can eat many pests in one day. Kids often find them on green leaves. Ladybugs have red and black spots.",
    sourceHeadline: "Gardeners welcome ladybugs as natural pest control",
    sourceUrl: null,
  },
  {
    level: "ELEMENTARY",
    category: "sports",
    title: "A Class Walks a Mile Every Morning",
    script:
      "One school starts each day with a walk. Students walk one mile before class begins. Teachers say it helps kids focus better. The class walks rain or shine. Kids chat and laugh along the path. Everyone feels ready to learn after the walk.",
    sourceHeadline: "School adds daily walk to morning routine",
    sourceUrl: null,
  },
  {
    level: "MIDDLE",
    category: "world",
    title: "A Village Builds a Bridge Together",
    script:
      "A small village needed a new bridge to cross its river. Instead of waiting for help, the villagers decided to build it themselves. Every family contributed wood, tools, or time to the project. It took nearly two months to finish the bridge. Now students can walk safely to school every day. Farmers also use the bridge to carry their crops to market. The villagers say the project brought their community closer together. They plan to build a second bridge next year.",
    sourceHeadline: "Villagers complete community-built river bridge",
    sourceUrl: null,
  },
  {
    level: "MIDDLE",
    category: "world",
    title: "A City Turns Old Buses into Libraries",
    script:
      "A busy city found a creative way to reuse old buses. Workers removed the seats and filled the buses with bookshelves. Each bus now travels to neighborhoods that don't have a library nearby. Children can borrow books and read inside the bus for free. The idea started with just one bus two years ago. Now the city has five traveling libraries. Local artists painted colorful designs on the outside of each bus. Residents say the buses have made reading more exciting for kids.",
    sourceHeadline: "City expands traveling library bus program",
    sourceUrl: null,
  },
  {
    level: "MIDDLE",
    category: "sports",
    title: "A Young Swimmer Breaks a School Record",
    script:
      "A twelve-year-old swimmer recently broke her school's fifty-meter freestyle record. She had been training every morning before school for almost a year. Her coach said her determination made the biggest difference. On the day of the race, she felt nervous but focused. She finished the race nearly two seconds faster than the old record. Her teammates cheered loudly from the pool deck. The young swimmer said she wants to keep improving for the next competition. Her story has inspired other students to join the swim team.",
    sourceHeadline: "Young swimmer sets new school freestyle record",
    sourceUrl: null,
  },
  {
    level: "MIDDLE",
    category: "sports",
    title: "A Soccer Team Plants Trees After Every Win",
    script:
      "A youth soccer team started an unusual tradition this season. After every match they win, the players plant a tree near their field. The idea came from one player who cares deeply about the environment. So far, the team has planted more than twenty trees. Local parents have started joining the planting events too. The coach says the tradition teaches players about teamwork off the field as well. Other youth teams in the area are now copying the idea. The players hope their field will look like a small forest someday.",
    sourceHeadline: "Youth soccer team plants trees after each victory",
    sourceUrl: null,
  },
  {
    level: "MIDDLE",
    category: "science",
    title: "Students Test Water Quality in a Local River",
    script:
      "A group of middle school students started testing water samples from a nearby river. They collect samples once a week and check for pollution levels. Their science teacher helped them build simple testing kits using cheap materials. The students share their results with the local government every month. Recently, they discovered a small area where the water quality had dropped. City workers were able to fix the problem quickly because of the students' report. The students say the project taught them that science can solve real problems. They plan to expand their testing to two more rivers next year.",
    sourceHeadline: "Student science club monitors local river health",
    sourceUrl: null,
  },
  {
    level: "MIDDLE",
    category: "technology",
    title: "A Library Adds Coding Robots for Kids",
    script:
      "A local library recently added small robots that teach kids how to code. Students use simple blocks of instructions to make the robots move and talk. The robots are popular during the library's weekend coding club. Librarians say the program has more than doubled in size since it started. Many kids who join have never coded before. One student built a robot that could solve a small maze in under a minute. The library plans to buy more robots next year because of the high demand. Parents say the program makes learning technology feel like play.",
    sourceHeadline: "Library coding club grows with new robot kits",
    sourceUrl: null,
  },
  {
    level: "JUNIOR",
    category: "science",
    title: "Researchers Study How Octopuses Change Color",
    script:
      "Marine biologists have long been fascinated by the octopus's ability to change color in an instant. A recent study used high-speed cameras to examine exactly how this process works at the cellular level. Researchers discovered that octopuses can sense light through specialized cells in their skin, not just their eyes. This allows them to react to their surroundings even faster than scientists previously believed. The team observed that different colors served different purposes, from camouflage to communication with other octopuses. Some patterns appeared only during moments of stress or excitement. The researchers hope their findings could eventually inspire new materials that change color on demand. They plan to continue studying other cephalopods to see if similar abilities exist across species.",
    sourceHeadline: "Study reveals how octopus skin senses light",
    sourceUrl: null,
  },
  {
    level: "JUNIOR",
    category: "science",
    title: "A New Battery Could Charge Phones in Seconds",
    script:
      "Engineers at a research lab have developed an experimental battery that can charge a smartphone in under thirty seconds. The technology relies on a new type of material that allows electricity to flow much faster than in traditional batteries. Unlike current lithium batteries, the new design also appears to lose very little capacity over repeated charges. Researchers caution that the battery is still years away from commercial use, since manufacturing it at scale remains a major challenge. Early tests, however, have shown promising results in both speed and safety. If successful, the technology could dramatically change how people use electric vehicles and portable devices. Several tech companies have already expressed interest in licensing the research. The team says their next goal is to test the battery in real-world conditions rather than a controlled lab.",
    sourceHeadline: "Lab unveils prototype for ultra-fast charging battery",
    sourceUrl: null,
  },
  {
    level: "JUNIOR",
    category: "technology",
    title: "Engineers Design a Drone That Delivers Medicine",
    script:
      "A team of engineers has built a drone specifically designed to deliver medicine to remote areas that are difficult to reach by road. The drone can carry small packages, such as vaccines or emergency medication, over distances of more than sixty kilometers. During recent trials, the drone successfully delivered supplies to a rural clinic in under twenty minutes, a trip that normally takes hours by car. Healthcare workers say the technology could be especially valuable during natural disasters, when roads are often blocked or damaged. The engineers designed the drone to fly automatically using GPS, reducing the need for a trained pilot. They are now working with local governments to expand testing to additional regions. If the program continues to succeed, similar drones could soon be used for emergency deliveries around the world.",
    sourceHeadline: "Medical delivery drone completes rural clinic trial",
    sourceUrl: null,
  },
  {
    level: "JUNIOR",
    category: "sports",
    title: "A Teenage Runner Trains for the National Championship",
    script:
      "A sixteen-year-old distance runner has become one of the most promising young athletes in the country ahead of this year's national championship. She began running competitively at age eleven, inspired by watching marathon races on television with her family. Her training schedule now includes early morning runs, strength exercises, and careful attention to nutrition. Coaches say her natural endurance is impressive, but her mental discipline sets her apart from other runners her age. Balancing school and training has not been easy, and she credits her teachers for helping her manage both responsibilities. Last month, she recorded her fastest time yet in a regional qualifying race. Her long-term goal is to represent her country in international competitions within the next few years. For now, she says she is simply focused on running the best race she can.",
    sourceHeadline: "Teen distance runner qualifies for national meet",
    sourceUrl: null,
  },
  {
    level: "JUNIOR",
    category: "sports",
    title: "A School Robotics Team Competes Like Athletes",
    script:
      "At many schools, robotics teams have started to adopt the same intense preparation once reserved for traditional sports teams. One high school's robotics club now practices nearly every day after school, building and testing robots for regional competitions. Team members describe the atmosphere as similar to that of a varsity sport, complete with strategy sessions and mock competitions. Coaches, who are often engineering teachers, emphasize both technical skill and teamwork under pressure. During competitions, teams have only a few minutes to fix problems with their robots, which creates a fast-paced, high-stakes environment. The team recently placed second at a national tournament, drawing attention from local news outlets. Members say the experience has taught them as much about collaboration as it has about engineering. Several students on the team plan to pursue careers in robotics or computer science after graduation.",
    sourceHeadline: "High school robotics team places second nationally",
    sourceUrl: null,
  },
  {
    level: "JUNIOR",
    category: "world",
    title: "A Youth Council Helps Redesign a City Park",
    script:
      "When city officials announced plans to renovate a rundown park, they decided to include a youth council made up entirely of teenagers in the design process. Over several months, the council held public meetings, gathered feedback from neighbors, and presented their own ideas to city planners. Many of their proposals, including a skate area and a community garden, were eventually approved for the final design. City officials say involving young people led to ideas that adult planners might not have considered. The teenagers also learned valuable lessons about budgeting, negotiation, and public speaking during the process. Construction on the new park began this spring and is expected to finish by next summer. Local leaders now hope to include youth councils in future public projects across the city. For the teenagers involved, seeing their ideas become real changes has been especially rewarding.",
    sourceHeadline: "Teen council shapes redesign of city park",
    sourceUrl: null,
  },
];

async function main() {
  const existingCount = await prisma.article.count();
  if (existingCount > 0) {
    console.log(`이미 스토리가 ${existingCount}개 있어서 샘플을 건너뛰어요.`);
    return;
  }

  for (const article of SAMPLE_ARTICLES) {
    await prisma.article.create({ data: article });
  }
  console.log(`${SAMPLE_ARTICLES.length}개의 샘플 스토리를 추가했어요.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
