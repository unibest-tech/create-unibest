// 测试版本获取函数
import { getUnibestVersionFromGitee, getUnibestVersionFromGithub } from './dist/utils/unibestVersion.js';

async function testVersions() {
  console.log('Testing version retrieval functions...');

  try {
    // 测试Gitee版本获取
    const giteeVersion = await getUnibestVersionFromGitee();
    console.log('Gitee version:', giteeVersion);

    // 测试GitHub版本获取
    const githubVersion = await getUnibestVersionFromGithub();
    console.log('GitHub version:', githubVersion);

    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Error during testing:', error);
  }
}

testVersions();