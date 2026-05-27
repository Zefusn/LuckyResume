<template>
  <div class="resume-preview-container" :class="`template-${templateStyle}`" :style="colorVars">
    <div class="resume-page">
      <!-- 头部基本信息 -->
      <div class="resume-header">
        <div class="header-content">
          <div class="header-left">
            <div class="avatar-wrapper" v-if="content.basic.avatar">
              <img :src="content.basic.avatar" class="avatar-img" />
            </div>
            <div class="header-info">
              <h1 class="name">{{ content.basic.name || '您的姓名' }}</h1>
              <div class="title-line" v-if="content.basic.jobTitle || content.basic.workYears">
                <span v-if="content.basic.jobTitle" class="job-title">{{ content.basic.jobTitle }}</span>
                <span v-if="content.basic.jobTitle && content.basic.workYears" class="divider">|</span>
                <span v-if="content.basic.workYears" class="work-years">{{ content.basic.workYears }}年工作经验</span>
              </div>
              <div class="contact-row">
                <span v-if="content.basic.phone" class="contact-item">
                  <n-icon size="13"><CallOutline /></n-icon>
                  {{ content.basic.phone }}
                </span>
                <span v-if="content.basic.email" class="contact-item">
                  <n-icon size="13"><MailOutline /></n-icon>
                  {{ content.basic.email }}
                </span>
                <span v-if="content.basic.location" class="contact-item">
                  <n-icon size="13"><LocationOutline /></n-icon>
                  {{ content.basic.location }}
                </span>
                <span v-if="content.basic.personalWebsite" class="contact-item">
                  <n-icon size="13"><GlobeOutline /></n-icon>
                  {{ content.basic.personalWebsite }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 求职意向 -->
      <div class="section" v-if="hasIntention">
        <div class="section-title">
          <n-icon size="16"><BriefcaseOutline /></n-icon>
          <span>求职意向</span>
        </div>
        <div class="intention-grid">
          <div class="intention-item" v-if="content.intention.position">
            <span class="label">目标岗位</span>
            <span class="value">{{ content.intention.position }}</span>
          </div>
          <div class="intention-item" v-if="content.intention.city">
            <span class="label">期望城市</span>
            <span class="value">{{ content.intention.city }}</span>
          </div>
          <div class="intention-item" v-if="content.intention.salary">
            <span class="label">期望薪资</span>
            <span class="value">{{ content.intention.salary }}</span>
          </div>
          <div class="intention-item" v-if="content.intention.jobType">
            <span class="label">工作类型</span>
            <span class="value">{{ content.intention.jobType }}</span>
          </div>
          <div class="intention-item" v-if="content.intention.industry">
            <span class="label">期望行业</span>
            <span class="value">{{ content.intention.industry }}</span>
          </div>
        </div>
      </div>

      <!-- 教育背景 -->
      <div class="section" v-if="content.education.length">
        <div class="section-title">
          <n-icon size="16"><SchoolOutline /></n-icon>
          <span>教育背景</span>
        </div>
        <div class="timeline-list">
          <div v-for="edu in content.education" :key="edu.id" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="item-header">
                <span class="item-name">{{ edu.school }}</span>
                <span class="item-date" v-if="edu.startDate">{{ edu.startDate }} — {{ edu.endDate }}</span>
              </div>
              <div class="item-sub">
                <span v-if="edu.major" class="sub-tag">{{ edu.major }}</span>
                <span v-if="edu.degree" class="sub-tag">{{ edu.degree }}</span>
                <span v-if="edu.gpa" class="sub-tag highlight">GPA {{ edu.gpa }}</span>
              </div>
              <p class="item-desc" v-if="edu.description">{{ edu.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 工作经历 -->
      <div class="section" v-if="content.work.length">
        <div class="section-title">
          <n-icon size="16"><BuildOutline /></n-icon>
          <span>工作经历</span>
        </div>
        <div class="timeline-list">
          <div v-for="work in content.work" :key="work.id" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="item-header">
                <span class="item-name">{{ work.company }}</span>
                <span class="item-date" v-if="work.startDate">{{ work.startDate }} — {{ work.isCurrent ? '至今' : work.endDate }}</span>
              </div>
              <div class="item-position" v-if="work.position">{{ work.position }}</div>
              <p class="item-desc" v-if="work.description">{{ work.description }}</p>
              <ul class="achievements" v-if="work.achievements?.length">
                <li v-for="(a, i) in work.achievements" :key="i">{{ a }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目经历 -->
      <div class="section" v-if="content.project.length">
        <div class="section-title">
          <n-icon size="16"><CodeWorkingOutline /></n-icon>
          <span>项目经历</span>
        </div>
        <div class="timeline-list">
          <div v-for="project in content.project" :key="project.id" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="item-header">
                <span class="item-name">{{ project.name }}</span>
                <span class="item-date" v-if="project.startDate">{{ project.startDate }} — {{ project.endDate }}</span>
              </div>
              <div class="item-position" v-if="project.role">{{ project.role }}</div>
              <p class="item-desc" v-if="project.description">{{ project.description }}</p>
              <div class="tech-tags" v-if="project.technologies?.length">
                <n-tag v-for="tech in project.technologies" :key="tech" size="small" :bordered="false" type="info">{{ tech }}</n-tag>
              </div>
              <ul class="achievements" v-if="project.achievements?.length">
                <li v-for="(a, i) in project.achievements" :key="i">{{ a }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 专业技能 -->
      <div class="section" v-if="content.skills.length">
        <div class="section-title">
          <n-icon size="16"><RibbonOutline /></n-icon>
          <span>专业技能</span>
        </div>
        <div class="skills-grid">
          <div v-for="skill in content.skills" :key="skill.id" class="skill-item">
            <div class="skill-header">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-level-text">{{ getSkillLevelText(skill.level) }}</span>
            </div>
            <div class="skill-bar">
              <div class="skill-fill" :style="{ width: (skill.level / 5 * 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 获奖荣誉 -->
      <div class="section" v-if="content.awards.length">
        <div class="section-title">
          <n-icon size="16"><TrophyOutline /></n-icon>
          <span>获奖荣誉</span>
        </div>
        <div class="awards-grid">
          <div v-for="award in content.awards" :key="award.id" class="award-item">
            <div class="award-icon">
              <n-icon size="18" color="#f0a020"><TrophyOutline /></n-icon>
            </div>
            <div class="award-info">
              <span class="award-name">{{ award.name }}</span>
              <span class="award-meta" v-if="award.issuer || award.date">
                {{ award.issuer }}{{ award.issuer && award.date ? ' · ' : '' }}{{ award.date }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 培训经历 -->
      <div class="section" v-if="content.training.length">
        <div class="section-title">
          <n-icon size="16"><BookOutline /></n-icon>
          <span>培训经历</span>
        </div>
        <div class="timeline-list">
          <div v-for="t in content.training" :key="t.id" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="item-header">
                <span class="item-name">{{ t.institution }}</span>
                <span class="item-date" v-if="t.startDate">{{ t.startDate }} — {{ t.endDate }}</span>
              </div>
              <div class="item-position" v-if="t.course">{{ t.course }}</div>
              <span class="certificate-tag" v-if="t.certificate">
                <n-icon size="12"><RibbonOutline /></n-icon>
                {{ t.certificate }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 语言能力 -->
      <div class="section" v-if="content.languages.length">
        <div class="section-title">
          <n-icon size="16"><LanguageOutline /></n-icon>
          <span>语言能力</span>
        </div>
        <div class="languages-grid">
          <div v-for="lang in content.languages" :key="lang.id" class="lang-item">
            <span class="lang-name">{{ lang.name }}</span>
            <span class="lang-level">{{ lang.level }}</span>
            <span class="lang-cert" v-if="lang.certificate">{{ lang.certificate }}</span>
          </div>
        </div>
      </div>

      <!-- 自我评价 -->
      <div class="section" v-if="content.selfEvaluation">
        <div class="section-title">
          <n-icon size="16"><ChatboxOutline /></n-icon>
          <span>自我评价</span>
        </div>
        <p class="self-evaluation">{{ content.selfEvaluation }}</p>
      </div>

      <!-- 兴趣爱好 -->
      <div class="section" v-if="content.hobbies?.length">
        <div class="section-title">
          <n-icon size="16"><HeartOutline /></n-icon>
          <span>兴趣爱好</span>
        </div>
        <div class="hobbies-tags">
          <span v-for="(hobby, i) in content.hobbies" :key="i" class="hobby-tag">{{ hobby }}</span>
        </div>
      </div>

      <!-- 作品集 -->
      <div class="section" v-if="content.portfolio?.length">
        <div class="section-title">
          <n-icon size="16"><FolderOpenOutline /></n-icon>
          <span>作品集</span>
        </div>
        <div class="portfolio-list">
          <div v-for="p in content.portfolio" :key="p.id" class="portfolio-item">
            <n-icon size="14" color="#3B82F6"><FolderOpenOutline /></n-icon>
            <span class="portfolio-title">{{ p.title }}</span>
            <a v-if="p.url" :href="p.url" class="portfolio-link" target="_blank">{{ p.url }}</a>
          </div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <div class="empty-hint" v-if="isEmpty">
        <div class="empty-icon">
          <n-icon size="48" color="#ddd"><DocumentTextOutline /></n-icon>
        </div>
        <p class="empty-title">开始编辑您的简历</p>
        <p class="empty-sub">在左侧填写信息，这里会实时预览效果</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  CallOutline, MailOutline, LocationOutline, GlobeOutline,
  BriefcaseOutline, SchoolOutline, BuildOutline, CodeWorkingOutline,
  TrophyOutline, RibbonOutline, BookOutline, ChatboxOutline,
  HeartOutline, LanguageOutline, FolderOpenOutline, DocumentTextOutline
} from '@vicons/ionicons5'
import type { ResumeContent } from '@/types'

const props = defineProps<{
  content: ResumeContent
  color?: string
  templateStyle?: string
}>()

const primaryColor = computed(() => props.color || '#3B82F6')

const colorVars = computed(() => ({
  '--primary-color': primaryColor.value,
  '--primary-light': primaryColor.value + '18',
  '--primary-border': primaryColor.value + '30'
}))

const hasIntention = computed(() => {
  const i = props.content.intention
  return i.position || i.city || i.salary || i.jobType || i.industry
})

const isEmpty = computed(() => {
  const c = props.content
  return !c.basic.name &&
    !c.education.length &&
    !c.work.length &&
    !c.project.length &&
    !c.skills.length &&
    !c.selfEvaluation
})

function getSkillLevelText(level: number): string {
  const texts = ['入门', '了解', '熟悉', '熟练', '精通']
  return texts[level - 1] || ''
}
</script>

<style lang="scss" scoped>
.resume-preview-container {
  padding: 16px;
}

.resume-page {
  background: #fff;
  padding: 36px 40px;
  font-family: 'Microsoft YaHei', 'PingFang SC', -apple-system, sans-serif;
  font-size: 12px;
  line-height: 1.6;
  color: #333;
  min-height: 297mm;
  border-radius: 4px;
}

// 头部
.resume-header {
  margin-bottom: 20px;
  padding-bottom: 18px;
  border-bottom: 2px solid var(--primary-color, #3B82F6);
}

.header-content {
  display: flex;
  align-items: flex-start;
}

.header-left {
  display: flex;
  gap: 16px;
  flex: 1;
}

.avatar-wrapper {
  width: 80px;
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid var(--primary-light, #e8f5e9);

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.header-info {
  flex: 1;
}

.name {
  font-size: 26px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
  letter-spacing: 2px;
}

.title-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;

  .job-title {
    font-size: 14px;
    color: var(--primary-color, #3B82F6);
    font-weight: 500;
  }

  .divider {
    color: #ddd;
  }

  .work-years {
    font-size: 13px;
    color: #666;
  }
}

.contact-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  .contact-item {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #555;
    font-size: 12px;
  }
}

// 段落
.section {
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: var(--primary-color, #3B82F6);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--primary-border, #e8f5e9);
  margin-bottom: 12px;

  span {
    letter-spacing: 1px;
  }
}

// 求职意向
.intention-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
}

.intention-item {
  display: flex;
  align-items: center;
  gap: 8px;

  .label {
    color: #888;
    font-size: 12px;
    min-width: 56px;
  }

  .value {
    font-size: 13px;
    color: #333;
    font-weight: 500;
  }
}

// 时间线列表
.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.timeline-item {
  display: flex;
  gap: 12px;
  position: relative;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-color, #3B82F6);
  margin-top: 6px;
  flex-shrink: 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 10px;
    left: 3px;
    width: 2px;
    height: calc(100% + 14px);
    background: var(--primary-border, #e8f5e9);
  }
}

.timeline-item:last-child .timeline-dot::after {
  display: none;
}

.timeline-content {
  flex: 1;
  min-width: 0;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2px;
}

.item-name {
  font-weight: 600;
  font-size: 14px;
  color: #1a1a1a;
}

.item-date {
  color: #999;
  font-size: 11px;
  flex-shrink: 0;
}

.item-position {
  color: var(--primary-color, #3B82F6);
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
}

.item-sub {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.sub-tag {
  font-size: 12px;
  color: #666;
  background: #f5f7fa;
  padding: 1px 8px;
  border-radius: 3px;

  &.highlight {
    color: var(--primary-color, #3B82F6);
    background: var(--primary-light, #e8f5e9);
  }
}

.item-desc {
  color: #444;
  font-size: 12px;
  line-height: 1.8;
  margin-bottom: 4px;
}

.achievements {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;

  li {
    font-size: 12px;
    line-height: 1.8;
    color: #444;
    padding-left: 16px;
    position: relative;

    &::before {
      content: '▸';
      position: absolute;
      left: 0;
      color: var(--primary-color, #3B82F6);
    }
  }
}

// 技术标签
.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 4px;
}

// 技能
.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 24px;
}

.skill-item {
  .skill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .skill-name {
    font-size: 13px;
    font-weight: 500;
    color: #333;
  }

  .skill-level-text {
    font-size: 11px;
    color: #999;
  }
}

.skill-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;

  .skill-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color, #3B82F6), var(--primary-color, #60A5FA));
    border-radius: 3px;
    transition: width 0.3s ease;
  }
}

// 获奖
.awards-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.award-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.award-icon {
  flex-shrink: 0;
}

.award-info {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.award-name {
  font-weight: 500;
  font-size: 13px;
  color: #333;
}

.award-meta {
  color: #999;
  font-size: 12px;
}

// 证书
.certificate-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #f0a020;
  background: #fffbe6;
  padding: 2px 8px;
  border-radius: 3px;
  border: 1px solid #ffe58f;
}

// 语言
.languages-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.lang-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #eee;

  .lang-name {
    font-weight: 600;
    font-size: 13px;
    color: #333;
  }

  .lang-level {
    font-size: 12px;
    color: var(--primary-color, #3B82F6);
  }

  .lang-cert {
    font-size: 11px;
    color: #999;
  }
}

// 自我评价
.self-evaluation {
  font-size: 13px;
  line-height: 1.9;
  color: #444;
  text-indent: 2em;
}

// 爱好
.hobbies-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hobby-tag {
  display: inline-block;
  padding: 4px 14px;
  background: #f0f7ff;
  color: #2080f0;
  border-radius: 14px;
  font-size: 12px;
  border: 1px solid #d0e3ff;
}

// 作品集
.portfolio-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.portfolio-item {
  display: flex;
  align-items: center;
  gap: 8px;

  .portfolio-title {
    font-weight: 500;
    font-size: 13px;
    color: #333;
  }

  .portfolio-link {
    font-size: 12px;
    color: var(--primary-color, #3B82F6);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

// 空状态
.empty-hint {
  text-align: center;
  padding: 60px 0;

  .empty-icon {
    margin-bottom: 16px;
  }

  .empty-title {
    font-size: 16px;
    color: #999;
    margin-bottom: 8px;
  }

  .empty-sub {
    font-size: 13px;
    color: #ccc;
  }
}

// 模板样式变体
.template-classic {
  .resume-header {
    border-bottom: 3px double var(--primary-color, #3B82F6);
  }

  .section-title {
    background: var(--primary-light, #e8f5e9);
    padding: 6px 10px;
    border-bottom: none;
    border-radius: 4px;
  }
}

.template-minimal {
  .resume-header {
    border-bottom: 1px solid #eee;
  }

  .section-title {
    font-weight: 500;
    border-bottom: 1px dashed #ddd;
    color: #333;
  }

  .timeline-dot {
    background: #ccc;
  }

  .item-position {
    color: #555;
  }
}
</style>
