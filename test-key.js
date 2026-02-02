const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyDbxhEHL2tfCVwcvIvipxdpIzK-ZSMMNRU');

async function testModel() {
  try {
    console.log('API Key 테스트 중...\n');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Say hello');
    const response = await result.response;
    console.log('✅ 성공! 응답:', response.text());
  } catch (error) {
    console.error('❌ 오류:', error.message);
  }
}

testModel();
