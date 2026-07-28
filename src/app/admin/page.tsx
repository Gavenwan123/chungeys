"use client";

import { useState, useEffect } from "react";
import resourcesData from "@/data/resources.json";

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
  quark: { link: string; code: string } | null;
  description: string;
}

export default function AdminPage() {
  const [data, setData] = useState<Resource[]>([]);
  const [saved, setSaved] = useState(false);
  const [newItem, setNewItem] = useState(false);
  const [form, setForm] = useState<Partial<Resource>>({
    name: "", category: "热播剧", tags: [], quality: "1080P",
    episodes: "更01集", status: "更新中", year: 2025, platform: "", cast: "",
    baidu: null, quark: null, description: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("yingshi-resources");
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      setData(resourcesData as Resource[]);
    }
  }, []);

  const updateEpisode = (id: string, episodes: string) => {
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, episodes } : r)));
    setSaved(false);
  };

  const updateStatus = (id: string, status: string) => {
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setSaved(false);
  };

  const updateLink = (id: string, type: "baidu" | "quark", field: "link" | "code", value: string) => {
    setData((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const current = r[type];
        if (!current) {
          return { ...r, [type]: { link: field === "link" ? value : "", code: field === "code" ? value : "" } };
        }
        return { ...r, [type]: { ...current, [field]: value } };
      })
    );
    setSaved(false);
  };

  const save = () => {
    localStorage.setItem("yingshi-resources", JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resources.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const addResource = () => {
    if (!form.name) return alert("请填写剧名");
    const newItem: Resource = {
      id: `${form.name}-${form.year}-${Date.now()}`,
      name: form.name || "",
      category: form.category || "热播剧",
      tags: (form.tags as string[]) || [],
      quality: form.quality || "1080P",
      episodes: form.episodes || "更01集",
      status: form.status || "更新中",
      year: form.year || 2025,
      platform: form.platform || "",
      cast: form.cast || "—",
      baidu: form.baidu || null,
      quark: form.quark || null,
      description: form.description || "",
    };
    setData((prev) => [newItem, ...prev]);
    setNewItem(false);
    setForm({ name: "", category: "热播剧", tags: [], quality: "1080P", episodes: "更01集", status: "更新中", year: 2025, platform: "", cast: "", baidu: null, quark: null, description: "" });
    setSaved(false);
  };

  const deleteResource = (id: string) => {
    if (!confirm("确认删除？")) return;
    setData((prev) => prev.filter((r) => r.id !== id));
    setSaved(false);
  };

  if (data.length === 0) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">加载中...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">🍒 春哥影视 · 资源管理</h1>
          <div className="flex gap-2">
            <button onClick={() => setNewItem(true)} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-bold">+ 添加资源</button>
            <button onClick={save} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${saved ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"}`}>
              {saved ? "✓ 已保存" : "💾 保存"}
            </button>
            <button onClick={exportJSON} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-bold">
              ⬇ 导出JSON
            </button>
          </div>
        </div>

        {saved && <p className="text-green-400 text-sm mb-2">✓ 已保存到浏览器，导出JSON后替换项目中的文件即可生效</p>}

        {/* 添加新资源表单 */}
        {newItem && (
          <div className="bg-gray-900 rounded-xl p-4 mb-4 border border-green-800">
            <h3 className="text-sm font-bold text-green-400 mb-3">添加新资源</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <input placeholder="剧名 *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 bg-gray-800 rounded text-sm border border-gray-700" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 bg-gray-800 rounded text-sm border border-gray-700">
                {["热播剧", "经典剧", "电影", "动漫", "外剧", "小众"].map((c) => <option key={c}>{c}</option>)}
              </select>
              <input placeholder="年份" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className="px-3 py-2 bg-gray-800 rounded text-sm border border-gray-700" />
              <input placeholder="集数 如: 更01集" value={form.episodes} onChange={(e) => setForm({ ...form, episodes: e.target.value })} className="px-3 py-2 bg-gray-800 rounded text-sm border border-gray-700" />
              <input placeholder="标签 逗号分隔" value={(form.tags as string[]).join(",")} onChange={(e) => setForm({ ...form, tags: e.target.value.split(",") })} className="px-3 py-2 bg-gray-800 rounded text-sm border border-gray-700" />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="px-3 py-2 bg-gray-800 rounded text-sm border border-gray-700">
                <option>更新中</option><option>已完结</option>
              </select>
              <input placeholder="演员" value={form.cast} onChange={(e) => setForm({ ...form, cast: e.target.value })} className="px-3 py-2 bg-gray-800 rounded text-sm border border-gray-700" />
              <select value={form.quality} onChange={(e) => setForm({ ...form, quality: e.target.value })} className="px-3 py-2 bg-gray-800 rounded text-sm border border-gray-700">
                <option>1080P</option><option>4K</option><option>HD</option>
              </select>
              <input placeholder="百度网盘链接" onChange={(e) => setForm({ ...form, baidu: { link: e.target.value, code: "" } })} className="px-3 py-2 bg-gray-800 rounded text-sm border border-gray-700 col-span-2" />
              <input placeholder="百度提取码" onChange={(e) => setForm({ ...form, baidu: { ...form.baidu, link: form.baidu?.link || "", code: e.target.value } })} className="px-3 py-2 bg-gray-800 rounded text-sm border border-gray-700" />
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={addResource} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-sm font-bold">确认添加</button>
              <button onClick={() => setNewItem(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm">取消</button>
            </div>
          </div>
        )}

        {/* 资源列表 */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="px-3 py-2 text-left">剧名</th>
                <th className="px-3 py-2 text-left w-24">集数</th>
                <th className="px-3 py-2 text-left w-20">状态</th>
                <th className="px-3 py-2 text-left w-20">分类</th>
                <th className="px-3 py-2 text-left w-32">百度链接</th>
                <th className="px-3 py-2 text-left w-16">提取码</th>
                <th className="px-3 py-2 text-center w-16">操作</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="px-3 py-2 font-medium">{r.name} <span className="text-gray-500 text-xs">{r.year}</span></td>
                  <td className="px-3 py-2">
                    <input
                      value={r.episodes}
                      onChange={(e) => updateEpisode(r.id, e.target.value)}
                      className="w-full px-2 py-1 bg-gray-800 rounded border border-gray-700 text-yellow-400 font-bold"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className="px-2 py-1 bg-gray-800 rounded border border-gray-700 text-xs">
                      <option>更新中</option><option>已完结</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 text-gray-400">{r.category}</td>
                  <td className="px-3 py-2">
                    <input
                      defaultValue={r.baidu?.link || ""}
                      onBlur={(e) => updateLink(r.id, "baidu", "link", e.target.value)}
                      className="w-full px-2 py-1 bg-gray-800 rounded border border-gray-700 text-xs"
                      placeholder="链接"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      defaultValue={r.baidu?.code || ""}
                      onBlur={(e) => updateLink(r.id, "baidu", "code", e.target.value)}
                      className="w-full px-2 py-1 bg-gray-800 rounded border border-gray-700 text-xs text-center"
                      placeholder="码"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button onClick={() => deleteResource(r.id)} className="text-red-500 hover:text-red-400 text-xs">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-800 text-sm text-gray-400">
          <p className="font-bold text-white mb-2">📌 使用说明</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>直接在表格中修改集数、状态、链接（自动保存输入）</li>
            <li>点「💾 保存」保存到浏览器本地</li>
            <li>点「⬇ 导出JSON」下载 resources.json 文件</li>
            <li>用下载的文件替换项目中 <code className="text-yellow-400">src/data/resources.json</code></li>
            <li>重新部署即可生效（Vercel自动部署）</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
