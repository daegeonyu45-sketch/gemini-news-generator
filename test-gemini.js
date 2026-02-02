const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyDSek8Rl9BRScgT32id_RKAVzdkPTQFa6w');

async function listModels() {
  try {
    console.log('사용 가능한 모델 목록 확인 중...\n');
    
    // 여러 모델 이름 시도
    const modelNames = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-2.0-flash-exp',
      'models/gemini-pro',
      'models/gemini-1.5-pro',
      'models/gemini-1.5-flash'
    ];
    
    for (const modelName of modelNames) {
      try {
        console.log(`테스트 중: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        const response = await result.response;
        console.log(`✅ ${modelName} - 작동함!`);
        console.log(`응답: ${response.text().substring(0, 50)}...\n`);
        break;
      } catch (error) {
        console.log(`❌ ${modelName} - 실패: ${error.message}\n`);
      }
    }
  } catch (error) {
    console.error('오류:', error);
  }
}

listModels();
