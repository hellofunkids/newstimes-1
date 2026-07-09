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
