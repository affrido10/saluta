const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

async function processFile(fileName, type) {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`Файл ${fileName} не найден, пропускаю...`);
    return [];
  }

  // Конвертируем в текст, так как его легче резать регулярками, чем HTML
  const result = await mammoth.extractRawText({ path: filePath });
  const text = result.value;

  // Регулярка ищет начало вопроса (цифра, точка, пробел) и захватывает всё до следующей цифры
  // Подходит для форматов "1. Вопрос:" и просто "1. Настройте..."
  const regex = /(\n\d+[\.\s]+[\s\S]+?)(?=\n\d+[\.\s]+|$)/g;
  const matches = text.matchAll(regex);
  
  const blocks = [];
  for (const match of matches) {
    const rawBlock = match[0].trim();
    const lines = rawBlock.split('\n');
    const title = lines[0].trim(); // Первая строка — это заголовок (вопрос)
    const content = lines.slice(1).join('<br>').trim(); // Остальное — контент

    blocks.push({
      id: parseInt(title) || Math.random(),
      title: title,
      content: content || "Ответ внутри файла",
      type: type
    });
  }
  return blocks;
}

async function run() {
  const theory = await processFile("theory_answers_mdk03_corrected.docx", "theory");
  const practice = await processFile("practical_answers_mdk03_detailed.docx", "practice");
  
  const allData = [...theory, ...practice];
  fs.writeFileSync(path.join(process.cwd(), "data.json"), JSON.stringify(allData, null, 2));
  console.log(`Готово! Обработано ${allData.length} вопросов.`);
}

run();
