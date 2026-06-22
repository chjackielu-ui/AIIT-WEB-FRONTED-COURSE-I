/* ============================================================
   舌尖BOSS — 挑战系统核心逻辑
   ============================================================ */

// ==================== 数据结构定义 ====================

// 心情选项
const MOODS = [
    { id: 'happy', emoji: '😊', label: '开心', tags: ['庆祝', '聚会', '重口'] },
    { id: 'sad', emoji: '😢', label: '难过', tags: ['治愈', '温暖', '汤类'] },
    { id: 'angry', emoji: '😤', label: '生气', tags: ['发泄', '辣味', '重口'] },
    { id: 'tired', emoji: '😴', label: '疲惫', tags: ['能量', '滋补', '鲜香'] },
    { id: 'calm', emoji: '🤔', label: '平静', tags: ['细品', '精致', '经典'] }
];

// 天气选项
const WEATHERS = [
    { id: 'sunny', emoji: '☀️', label: '晴天', tags: ['清爽', '开胃'] },
    { id: 'rainy', emoji: '🌧️', label: '雨天', tags: ['温暖', '汤类', '火锅'] },
    { id: 'cold', emoji: '❄️', label: '寒冷', tags: ['滋补', '热汤', '暖心'] },
    { id: 'hot', emoji: '🌡️', label: '炎热', tags: ['清凉', '开胃', '酸辣'] },
    { id: 'cloudy', emoji: '🌤️', label: '多云', tags: ['任意'] }
];

// 场景选项
const SCENES = [
    { id: 'alone', emoji: '🏠', label: '独自', tags: ['简餐', '面食', '快手'] },
    { id: 'family', emoji: '👨‍👩‍👧‍👦', label: '家庭', tags: ['大菜', '聚餐', '经典'] },
    { id: 'business', emoji: '💼', label: '商务', tags: ['经典', '名菜', '正式'] },
    { id: 'party', emoji: '🎉', label: '聚会', tags: ['分享', '火锅', '特色'] },
    { id: 'date', emoji: '💑', label: '约会', tags: ['精致', '浪漫', '小吃'] }
];

// 口味偏好
const TASTES = [
    { id: 'heavy', emoji: '🌶️', label: '重口味', tags: ['重口系', '麻辣系'] },
    { id: 'light', emoji: '🍬', label: '清淡', tags: ['鲜香系', '精致系'] },
    { id: 'any', emoji: '🥘', label: '随便', tags: [] }
];

// ==================== 今日BOSS计算 ====================

/**
 * 获取今日BOSS（基于日期的确定性随机）
 * 保证同一天所有用户看到的今日BOSS相同
 */
function getTodayBoss() {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    // 使用日期字符串生成种子
    let seed = 0;
    for (let i = 0; i < dateString.length; i++) {
        seed = ((seed << 5) - seed) + dateString.charCodeAt(i);
        seed = seed & seed;
    }

    // 基于种子生成索引
    const index = Math.abs(seed) % foodBosses.length;
    return foodBosses[index];
}

// ==================== 智能匹配算法 ====================

/**
 * 计算美食与条件的匹配度
 * @param {Object} food - 美食对象
 * @param {Object} conditions - 用户选择的条件 {mood, weather, scene, taste}
 * @returns {Object} {score: 分数, reasons: [匹配原因]}
 */
function calculateMatch(food, conditions) {
    let score = 60; // 基础分
    const reasons = [];

    // 获取用户选择的标签
    const moodTags = MOODS.find(m => m.id === conditions.mood)?.tags || [];
    const weatherTags = WEATHERS.find(w => w.id === conditions.weather)?.tags || [];
    const sceneTags = SCENES.find(s => s.id === conditions.scene)?.tags || [];
    const tasteTags = TASTES.find(t => t.id === conditions.taste)?.tags || [];

    // 口味匹配 (+15分)
    if (conditions.taste === 'any') {
        score += 5;
    } else if (tasteTags.includes(food.type)) {
        score += 15;
        reasons.push(`口味完美匹配（${food.type}）`);
    } else if (conditions.taste === 'heavy' && ['重口系', '麻辣系'].includes(food.type)) {
        score += 12;
        reasons.push('符合重口味偏好');
    } else if (conditions.taste === 'light' && ['鲜香系', '精致系', '酸甜系'].includes(food.type)) {
        score += 12;
        reasons.push('符合清淡口味');
    }

    // 场景匹配 (+10分)
    const sceneMatch = sceneTags.some(tag => {
        if (tag === '大菜' && food.level.includes('大菜')) return true;
        if (tag === '面食' && food.type === '面食系') return true;
        if (tag === '经典' && food.type === '经典系') return true;
        if (tag === '火锅' && food.name.includes('火锅')) return true;
        if (tag === '精致' && food.type === '精致系') return true;
        return false;
    });

    if (sceneMatch) {
        score += 10;
        reasons.push(`适合${SCENES.find(s => s.id === conditions.scene)?.label}场景`);
    }

    // 心情匹配 (+10分)
    const moodMatch = moodTags.some(tag => {
        if (tag === '治愈' && food.type === '鲜香系') return true;
        if (tag === '重口' && ['重口系', '麻辣系'].includes(food.type)) return true;
        if (tag === '温暖' && food.name.includes('汤')) return true;
        if (tag === '经典' && food.type === '经典系') return true;
        return false;
    });

    if (moodMatch) {
        score += 10;
        reasons.push(`治愈你的${MOODS.find(m => m.id === conditions.mood)?.label}心情`);
    }

    // 天气匹配 (+5分)
    const weatherMatch = weatherTags.some(tag => {
        if (tag === '汤类' && food.name.includes('汤')) return true;
        if (tag === '火锅' && food.name.includes('火锅')) return true;
        if (tag === '暖心' && ['鲜香系', '经典系'].includes(food.type)) return true;
        return tag === '任意';
    });

    if (weatherMatch) {
        score += 5;
        reasons.push(`适合${WEATHERS.find(w => w.id === conditions.weather)?.label}天气`);
    }

    // 安徽美食加分 (+5分)
    if (food.province === '安徽省') {
        score += 5;
        reasons.push('地道徽菜推荐');
    }

    // 确保分数不超过100
    score = Math.min(score, 100);

    return { score, reasons };
}

/**
 * 根据条件推荐美食列表（按匹配度排序）
 */
function recommendFoods(conditions) {
    const results = foodBosses.map(food => {
        const match = calculateMatch(food, conditions);
        return {
            food,
            score: match.score,
            reasons: match.reasons
        };
    });

    // 按分数降序排序
    results.sort((a, b) => b.score - a.score);

    return results;
}

// ==================== 挑战记录管理 ====================

const STORAGE_KEY = 'tongueOfBoss_challenges';

/**
 * 获取所有挑战记录
 */
function getChallengeRecords() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

/**
 * 保存挑战记录
 */
function saveChallengeRecord(foodId, conditions, matchScore) {
    const records = getChallengeRecords();

    const newRecord = {
        id: Date.now(),
        foodId,
        foodName: foodBosses.find(f => f.id === foodId)?.name,
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        conditions,
        matchScore,
        status: 'completed'
    };

    records.push(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

    return newRecord;
}

/**
 * 获取挑战统计
 */
function getChallengeStats() {
    const records = getChallengeRecords();
    const uniqueFoods = new Set(records.map(r => r.foodId));

    // 统计连续天数
    const dates = [...new Set(records.map(r => r.date))].sort();
    let consecutiveDays = 0;
    const today = new Date().toISOString().split('T')[0];

    if (dates.includes(today) || dates[dates.length - 1] === getYesterday()) {
        consecutiveDays = 1;
        for (let i = dates.length - 2; i >= 0; i--) {
            const diff = daysDiff(dates[i], dates[i + 1]);
            if (diff === 1) {
                consecutiveDays++;
            } else {
                break;
            }
        }
    }

    return {
        total: foodBosses.length,
        challenged: uniqueFoods.size,
        percentage: Math.round((uniqueFoods.size / foodBosses.length) * 100),
        consecutiveDays,
        totalRecords: records.length
    };
}

/**
 * 检查今天是否已挑战今日BOSS
 */
function hasChallengedTodayBoss() {
    const todayBoss = getTodayBoss();
    const records = getChallengeRecords();
    const today = new Date().toISOString().split('T')[0];

    return records.some(r => r.foodId === todayBoss.id && r.date === today);
}

/**
 * 获取成就列表
 */
function getAchievements() {
    const stats = getChallengeStats();
    const records = getChallengeRecords();

    const achievements = [
        { id: 'newbie', name: '美食新手', desc: '完成首次挑战', icon: '🥉', unlocked: stats.challenged >= 1 },
        { id: 'explorer', name: '美食达人', desc: '挑战5道美食', icon: '🥈', unlocked: stats.challenged >= 5 },
        { id: 'expert', name: '美食专家', desc: '挑战10道美食', icon: '🥇', unlocked: stats.challenged >= 10 },
        { id: 'master', name: '舌尖王者', desc: '挑战所有15道美食', icon: '👑', unlocked: stats.challenged >= 15 },
        { id: 'anhui', name: '安徽美食通', desc: '完成所有安徽美食', icon: '🏆', unlocked: records.filter(r => {
            const food = foodBosses.find(f => f.id === r.foodId);
            return food && food.province === '安徽省';
        }).length >= 10 },
        { id: 'streak', name: '每日打卡王', desc: '连续7天挑战', icon: '🌟', unlocked: stats.consecutiveDays >= 7 },
        { id: 'perfect', name: '完美匹配', desc: '10次匹配度>90%', icon: '🎯', unlocked: records.filter(r => r.matchScore >= 90).length >= 10 }
    ];

    return achievements;
}

// ==================== 辅助函数 ====================

function getYesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
}

function daysDiff(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

/**
 * 获取匹配度星级
 */
function getStarRating(score) {
    if (score >= 90) return '⭐⭐⭐⭐⭐';
    if (score >= 80) return '⭐⭐⭐⭐';
    if (score >= 70) return '⭐⭐⭐';
    if (score >= 60) return '⭐⭐';
    return '⭐';
}

/**
 * 获取匹配度等级文本
 */
function getMatchLevel(score) {
    if (score >= 90) return '完美匹配';
    if (score >= 80) return '高度推荐';
    if (score >= 70) return '值得尝试';
    if (score >= 60) return '可以考虑';
    return '不太推荐';
}
