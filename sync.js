/**
 * 一键同步脚本：读取 Excel 表格 → 更新 resources.json → 推送 GitHub
 * 
 * 使用方法：
 * 1. 先修改"资源录入表新.xlsx"（改集数、加新剧、改状态等）
 * 2. 双击"更新网站.bat"
 * 3. 等待自动完成，网站1-2分钟后更新
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const EXCEL_FILE = '资源录入表新.xlsx';
const JSON_FILE = 'src/data/resources.json';

console.log('========================================');
console.log('  春哥影视 - 资源同步工具');
console.log('========================================\n');

// 1. 检查 Excel 文件
if (!fs.existsSync(EXCEL_FILE)) {
  console.log('❌ 找不到文件: ' + EXCEL_FILE);
  console.log('   请确保 Excel 文件和脚本在同一目录下');
  pause();
  process.exit(1);
}

// 2. 读取 Excel
let XLSX;
try {
  XLSX = require('xlsx');
} catch (e) {
  console.log('⏳ 首次运行，安装依赖中...');
  execSync('npm install xlsx', { stdio: 'inherit' });
  XLSX = require('xlsx');
}

const buf = fs.readFileSync(EXCEL_FILE);
const wb = XLSX.read(buf, { type: 'buffer' });
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws);
console.log('✅ 读取 Excel 成功，共 ' + rows.length + ' 条记录\n');

// 3. 读取现有 JSON
const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
console.log('📁 当前 resources.json 共 ' + data.length + ' 条资源\n');

// 4. 解析百度链接
function parseLink(str) {
  if (!str) return null;
  const s = String(str);
  const urlMatch = s.match(/https:\/\/pan\.baidu\.com\/s\/[A-Za-z0-9_-]+/);
  const codeMatch = s.match(/提取码:\s*(\S+)/);
  if (urlMatch) {
    return { link: urlMatch[0], code: codeMatch ? codeMatch[1] : '' };
  }
  return null;
}

// 5. 生成 ID
function generateId(name) {
  return name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')
    .replace(/[\u4e00-\u9fa5]+/g, (m) => m)
    .substring(0, 20) + '-' + Date.now().toString(36);
}

// 6. 同步数据
let updated = 0;
let added = 0;

rows.forEach(row => {
  const name = row['剧名'];
  if (!name) return;

  const existing = data.find(d => d.name === name);

  if (existing) {
    // 更新已有资源
    let changed = false;
    const eps = row['集数'] !== undefined ? String(row['集数']) : null;
    const status = row['状态'];
    const baiduStr = row['百度链接'];
    const desc = row['简介'];
    const cast = row['演员'];
    const year = row['年份'];

    if (eps && eps !== existing.episodes) {
      // 格式化集数：纯数字加"更X集"前缀
      if (/^\d+$/.test(eps) && existing.status === '更新中') {
        existing.episodes = '更' + eps + '集';
      } else {
        existing.episodes = eps;
      }
      changed = true;
    }
    if (status && status !== existing.status) {
      existing.status = status;
      // 如果改成已完结，集数格式改为"X集全"
      if (status === '已完结' && existing.episodes && /^\d+$/.test(existing.episodes)) {
        existing.episodes = existing.episodes + '集全';
      }
      changed = true;
    }
    if (baiduStr) {
      const parsed = parseLink(baiduStr);
      if (parsed) {
        existing.baidu = parsed;
        changed = true;
      }
    }
    if (desc && desc !== existing.description) {
      existing.description = desc;
      changed = true;
    }
    if (cast && cast !== existing.cast) {
      existing.cast = cast;
      changed = true;
    }
    if (year && year !== existing.year) {
      existing.year = Number(year);
      changed = true;
    }

    if (changed) {
      console.log('  ✏️  更新: ' + name);
      updated++;
    }
  } else {
    // 新增资源
    const eps = row['集数'] !== undefined ? String(row['集数']) : '';
    const status = row['状态'] || '更新中';
    const baiduStr = row['百度链接'];
    const tagsStr = row['标签'] || row['标签(逗号分隔)'] || '';
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

    let episodes = eps;
    if (episodes && /^\d+$/.test(episodes)) {
      episodes = status === '更新中' ? '更' + episodes + '集' : episodes + '集全';
    }

    const newItem = {
      id: generateId(name),
      name: name,
      category: row['分类'] || '热播剧',
      tags: tags,
      quality: row['画质'] || '1080P',
      episodes: episodes,
      status: status,
      year: row['年份'] ? Number(row['年份']) : 0,
      platform: '',
      cast: row['演员'] || '',
      baidu: parseLink(baiduStr),
      quark: null,
      description: row['简介'] || ''
    };

    data.push(newItem);
    console.log('  ➕ 新增: ' + name);
    added++;
  }
});

// 7. 排序：更新中放前面
data.sort((a, b) => {
  if (a.status === '更新中' && b.status !== '更新中') return -1;
  if (a.status !== '更新中' && b.status === '更新中') return 1;
  return 0;
});

// 8. 保存 JSON
fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('\n✅ 同步完成！更新 ' + updated + ' 条，新增 ' + added + ' 条');
console.log('📁 resources.json 已保存（共 ' + data.length + ' 条）\n');

// 9. Git 提交推送
if (updated === 0 && added === 0) {
  console.log('ℹ️  没有变化，无需推送\n');
  pause();
  process.exit(0);
}

console.log('⏳ 正在推送到 GitHub...');
try {
  execSync('git add src/data/resources.json', { stdio: 'inherit' });
  execSync('git commit -m "同步资源 更新' + updated + '条 新增' + added + '条"', { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('\n🎉 推送成功！网站将在1-2分钟后自动更新');
  console.log('🌐 访问: chungeys.vip\n');
} catch (e) {
  console.log('\n❌ 推送失败，请检查网络连接');
  console.log('   你也可以手动在 GitHub Desktop 中推送\n');
}

pause();

function pause() {
  console.log('\n按任意键退出...');
  try {
    execSync('pause', { stdio: 'inherit', shell: 'cmd.exe' });
  } catch (e) {}
}
