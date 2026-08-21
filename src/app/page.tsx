"use client";

import { useState, useMemo } from "react";
import resources from "@/data/resources.json";

const CATEGORIES = ["全部", "热播剧", "经典剧", "电影", "动漫", "外剧", "韩国综艺", "小众"];
const STATUS_OPTIONS = ["全部", "更新中", "已完结"];

// 拉新推广链接（替换成你自己的推广链接）
const QUARK_PROMO = "https://pan.quark.cn/invite/register?code=YOUR_CODE";
const BAIDU_PROMO = "https://pan.baidu.com/download?code=YOUR_CODE";

// Q群信息
const QQ_GROUP = "114285283";
const QQ_GROUP_LINK = `https://qm.qq.com/cgi-bin/qm/qr?k=&jump_from=webapi&authKey=&group_code=${QQ_GROUP}`;

interface Resource {
  id: string;
  name: string;
  category: string;
  tags: string[];
  quality: string;
  episodes: string;
  status: string;
  year: number;
  platform: string;
  cast: string;
  baidu: { link: string; code: string } | null;
  quark: { link: string } | null;
  description: string;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("全部");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  const filtered = useMemo(() => {
    return (resources as Resource[]).filter((r) => {
      const matchSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.tags.some((t) => t.includes(search)) ||
        r.cast.includes(search);
      const matchCategory = category === "全部" || r.category === category;
      const matchStatus = statusFilter === "全部" || r.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [search, category, statusFilter]);

  const copyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-red-500">🍒 春哥影视</h1>
            <span className="text-xs text-gray-400">每日更新 · 全部免费</span>
          </div>
        </div>
      </header>

      {/* 双栏布局 */}
      <div className="max-w-[1400px] mx-auto px-4 pt-4 flex gap-4">
        {/* 左侧边栏 */}
        <aside className="hidden lg:block w-[220px] flex-shrink-0">
          <div className="sticky top-20 bg-gray-900 rounded-xl border border-gray-800 p-3 text-center">
            <img
              src="/qq-group.png"
              alt="春哥影视 Q群 114285283"
              className="w-full rounded-lg mb-3"
            />
            <p className="text-sm font-bold text-white">💎 春哥影视</p>
            <p className="text-xs text-gray-400 mt-1">小众精品 / 海外热门 / 擦边资源</p>
            <a
              href={QQ_GROUP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 text-xs font-bold rounded-lg transition w-full"
            >
              加群 {QQ_GROUP}
            </a>
            <p className="text-xs text-gray-500 mt-2">进群找群主，资源更全</p>
          </div>
        </aside>

        {/* 右侧主内容 */}
        <main className="flex-1 min-w-0">
      {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="搜索剧名、演员、标签..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <svg
            className="absolute left-3 top-3.5 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

      {/* Category Tabs */}
      <div className="pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                category === cat
                  ? "bg-red-600 text-white font-medium"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter + Count */}
      <div className="pt-3 flex items-center justify-between">
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded text-xs transition-all ${
                statusFilter === s
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowGuide(!showGuide)} className="text-xs text-gray-500 hover:text-gray-300 transition">
            {showGuide ? "收起说明 ▲" : "使用说明 ▼"}
          </button>
          <span className="text-xs text-gray-500">共 {filtered.length} 部</span>
        </div>
      </div>

      {/* 使用说明 */}
      {showGuide && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 正确使用方法 */}
          <div className="bg-blue-950/60 border border-blue-800/50 rounded-xl p-4">
            <h4 className="text-sm font-bold text-red-400 mb-2">💡 正确使用方法</h4>
            <p className="text-xs text-green-400 font-medium mb-2">📖 了解网盘观看流程</p>
            <ol className="text-xs text-blue-200 space-y-1 list-decimal list-inside">
              <li>复制网盘链接（点击复制按钮）</li>
              <li>打开百度网盘/夸克网盘 APP</li>
              <li>自动弹出分享文件夹</li>
              <li>点击「转存」保存到自己网盘</li>
              <li>回到自己网盘中播放观看</li>
            </ol>
          </div>

          {/* 搜索方法 */}
          <div className="bg-green-950/60 border border-green-800/50 rounded-xl p-4">
            <h4 className="text-sm font-bold text-orange-400 mb-2">🔍 搜索方法</h4>
            <ol className="text-xs text-green-200 space-y-1 list-decimal list-inside">
              <li>顶部搜索框输入剧名/演员</li>
              <li>点击分类按钮筛选类型（热播剧/经典/电影/动漫/外剧/小众）</li>
              <li>用「更新中/已完结」快速过滤状态</li>
            </ol>
            <p className="text-xs text-gray-400 mt-2">（搜不到就是暂无资源，后期持续更新）</p>
            <div className="mt-2 p-2 bg-red-950/50 rounded text-xs text-red-300">
              <p>⚠️ 注意：先转存 → 再观看 → 避免链接失效</p>
            </div>
          </div>

          {/* 注意事项 */}
          <div className="bg-orange-950/60 border border-orange-800/50 rounded-xl p-4">
            <h4 className="text-sm font-bold text-yellow-400 mb-2">⚠️ 注意事项</h4>
            <ul className="text-xs text-orange-200 space-y-1">
              <li>• 建议保存到网盘后用APP观看，体验更佳</li>
              <li>• 夸克和谐严重，缺集数就是被和谐了</li>
              <li>• <span className="text-yellow-300 font-bold">优先使用百度网盘</span>，资源更稳定</li>
              <li>• 没有网盘？先注册再保存（免费）</li>
              <li>• 擦边/小众/未删减资源请加Q群获取</li>
            </ul>
            <div className="mt-2 p-2 bg-yellow-950/50 rounded text-xs text-yellow-300 font-medium">
              💎 进群找群主，资源更全更新更快
            </div>
            <div className="mt-2 p-2 bg-gray-800/80 rounded text-center">
              <span className="text-sm text-white font-bold">Q群号：{QQ_GROUP}</span>
              <a href={QQ_GROUP_LINK} target="_blank" rel="noopener noreferrer" className="ml-3 px-3 py-1 bg-yellow-500 hover:bg-yellow-400 text-gray-900 text-xs font-bold rounded transition">点击加群</a>
            </div>
          </div>
        </div>
      )}

      {/* Resource List */}
      <div className="py-4 space-y-3">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all"
          >
            {/* Card */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold">{r.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        r.status === "更新中"
                          ? "bg-green-900 text-green-400"
                          : "bg-blue-900 text-blue-400"
                      }`}
                    >
                      {r.status}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-purple-900 text-purple-400">
                      {r.quality}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-400">
                    {r.episodes} · {r.year}
                  </div>
                  {r.cast && r.cast !== "—" && (
                    <div className="mt-1 text-xs text-gray-500">
                      {r.cast}
                    </div>
                  )}
                </div>
              </div>
              {/* Tags */}
              <div className="mt-2 flex gap-1 flex-wrap">
                {r.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Cloud Storage Links - 直接显示 */}
            <div className="px-4 pb-4 border-t border-gray-800 pt-3 mt-3">
              <div className="space-y-2">
                {r.baidu && (
                  <div className="text-sm">
                    <span className="text-blue-400 font-medium">百度网盘: </span>
                    <a href={r.baidu.link} target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-yellow-200 underline break-all">
                      {r.baidu.link}
                    </a>
                    {r.baidu.code && <div className="text-gray-400 mt-0.5">提取码: <span className="text-yellow-400 font-mono">{r.baidu.code}</span></div>}
                  </div>
                )}
                {r.quark && (
                  <div className="text-sm">
                    <span className="text-orange-400 font-medium">夸克网盘: </span>
                    <a href={r.quark.link} target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-yellow-200 underline break-all">
                      {r.quark.link}
                    </a>
                  </div>
                )}

              </div>
              <div className="mt-3 flex gap-2">
                {r.baidu && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyLink(r.baidu!.link + (r.baidu!.code ? " 提取码:" + r.baidu!.code : ""), r.id + "-baidu");
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition"
                  >
                    {copiedId === r.id + "-baidu" ? "✓ 已复制" : "复制百度链接"}
                  </button>
                )}
                {r.quark && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyLink(r.quark!.link, r.id + "-quark");
                    }}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded-lg transition"
                  >
                    {copiedId === r.id + "-quark" ? "✓ 已复制" : "复制夸克链接"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-4">🔍</p>
            <p>没有找到相关资源</p>
            <p className="text-sm mt-2">试试其他关键词或切换分类</p>
          </div>
        )}
      </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="max-w-[1400px] mx-auto px-4 py-8 text-center border-t border-gray-800 mt-8">
        <div className="bg-gray-900 rounded-xl p-4 mb-4 border border-gray-800">
          <img
            src="/qq-group.png"
            alt="春哥影视 Q群 114285283"
            className="w-40 mx-auto rounded-lg mb-3"
          />
          <p className="text-sm text-yellow-400 font-bold">🔞 小众精品 / 擦边资源 / 未删减版</p>
          <p className="text-xs text-gray-400 mt-1">进群找群主，资源更全更新更快</p>
          <p className="text-sm text-white font-bold mt-2">Q群号：{QQ_GROUP}</p>
          <a
            href={QQ_GROUP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg transition"
          >
            Q群 {QQ_GROUP}
          </a>
        </div>
        <p className="text-xs text-gray-600">春哥影视 · 仅供学习交流 · 请在24小时内删除</p>
      </footer>
    </div>
  );
}
