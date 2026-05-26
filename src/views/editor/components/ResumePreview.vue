<template>
  <div class="resume-preview-container">
    <div class="resume-page">
      <!-- 头部基本信息 -->
      <div class="resume-header">
        <div class="header-left">
          <h1 class="name">{{ content.basic.name || '您的姓名' }}</h1>
          <div class="job-title" v-if="content.basic.workYears">{{ content.basic.workYears }}年工作经验</div>
          <div class="contact-info">
            <span v-if="content.basic.phone">
              <n-icon size="14"><CallOutline /></n-icon>
              {{ content.basic.phone }}
            </span>
            <span v-if="content.basic.email">
              <n-icon size="14"><MailOutline /></n-icon>
              {{ content.basic.email }}
            </span>
            <span v-if="content.basic.location">
              <n-icon size="14"><LocationOutline /></n-icon>
              {{ content.basic.location }}
            </span>
          </div>
        </div>
      </div>

      <!-- 求职意向 -->
      <div class="section" v-if="hasIntention">
        <div class="section-title">求职意向</div>
        <div class="intention-info">
          <span v-if="content.intention.position">{{ content.intention.position }}</span>
          <span v-if="content.intention.city">{{ content.intention.city }}</span>
          <span v-if="content.intention.salary">{{ content.intention.salary }}</span>
          <span v-if="content.intention.jobType">{{ content.intention.jobType }}</span>
        </div>
      </div>

      <!-- 教育背景 -->
      <div class="section" v-if="content.education.length">
        <div class="section-title">教育背景</div>
        <div class="education-list">
          <div v-for="edu in content.education" :key="edu.id" class="education-item">
            <div class="item-header">
              <span class="school">{{ edu.school }}</span>
              <span class="date" v-if="edu.startDate">{{ edu.startDate }} - {{ edu.endDate }}</span>
            </div>
            <div class="item-sub">
              <span v-if="edu.major">{{ edu.major }}</span>
              <span v-if="edu.degree">{{ edu.degree }}</span>
              <span v-if="edu.gpa">GPA: {{ edu.gpa }}</span>
            </div>
            <p class="item-desc" v-if="edu.description">{{ edu.description }}</p>
          </div>
        </div>
      </div>

      <!-- 工作经历 -->
      <div class="section" v-if="content.work.length">
        <div class="section-title">工作经历</div>
        <div class="work-list">
          <div v-for="work in content.work" :key="work.id" class="work-item">
            <div class="item-header">
              <span class="company">{{ work.company }}</span>
              <span class="date" v-if="work.startDate">{{ work.startDate }} - {{ work.isCurrent ? '至今' : work.endDate }}</span>
            </div>
            <div class="position" v-if="work.position">{{ work.position }}</div>
            <p class="item-desc" v-if="work.description">{{ work.description }}</p>
            <ul class="achievements" v-if="work.achievements?.length">
              <li v-for="(a, i) in work.achievements" :key="i">{{ a }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 项目经历 -->
      <div class="section" v-if="content.project.length">
        <div class="section-title">项目经历</div>
        <div class="project-list">
          <div v-for="project in content.project" :key="project.id" class="project-item">
            <div class="item-header">
              <span class="project-name">{{ project.name }}</span>
              <span class="date" v-if="project.startDate">{{ project.startDate }} - {{ project.endDate }}</span>
            </div>
            <div class="role" v-if="project.role">{{ project.role }}</div>
            <p class="item-desc" v-if="project.description">{{ project.description }}</p>
            <div class="technologies" v-if="project.technologies?.length">
              <n-tag v-for="tech in project.technologies" :key="tech" size="small" :bordered="false">{{ tech }}</n-tag>
            </div>
            <ul class="achievements" v-if="project.achievements?.length">
              <li v-for="(a, i) in project.achievements" :key="i">{{ a }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 获奖荣誉 -->
      <div class="section" v-if="content.awards.length">
        <div class="section-title">获奖荣誉</div>
        <div class="awards-list">
          <div v-for="award in content.awards" :key="award.id" class="award-item">
            <span class="award-name">{{ award.name }}</span>
            <span class="award-meta" v-if="award.issuer">{{ award.issuer }}</span>
            <span class="award-date" v-if="award.date">{{ award.date }}</span>
          </div>
        </div>
      </div>

      <!-- 技能证书 -->
      <div class="section" v-if="content.skills.length">
        <div class="section-title">专业技能</div>
        <div class="skills-list">
          <div v-for="skill in content.skills" :key="skill.id" class="skill-item">
            <span class="skill-name">{{ skill.name }}</span>
            <div class="skill-level">
              <div v-for="i in 5" :key="i" class="level-dot" :class="{ active: i <= skill.level }" />
            </div>
          </div>
        </div>
      </div>

      <!-- 培训经历 -->
      <div class="section" v-if="content.training.length">
        <div class="section-title">培训经历</div>
        <div class="training-list">
          <div v-for="t in content.training" :key="t.id" class="training-item">
            <div class="item-header">
              <span class="institution">{{ t.institution }}</span>
              <span class="date" v-if="t.startDate">{{ t.startDate }} - {{ t.endDate }}</span>
            </div>
            <div class="course" v-if="t.course">{{ t.course }}</div>
            <span class="certificate" v-if="t.certificate">证书：{{ t.certificate }}</span>
          </div>
        </div>
      </div>

      <!-- 语言能力 -->
      <div class="section" v-if="content.languages.length">
        <div class="section-title">语言能力</div>
        <div class="languages-info">
          <span v-for="lang in content.languages" :key="lang.id" class="lang-item">
            {{ lang.name }}：{{ lang.level }}<span v-if="lang.certificate">（{{ lang.certificate }}）</span>
          </span>
        </div>
      </div>

      <!-- 自我评价 -->
      <div class="section" v-if="content.selfEvaluation">
        <div class="section-title">自我评价</div>
        <p class="self-evaluation">{{ content.selfEvaluation }}</p>
      </div>

      <!-- 兴趣爱好 -->
      <div class="section" v-if="content.hobbies?.length">
        <div class="section-title">兴趣爱好</div>
        <div class="hobbies-info">
          <span v-for="(hobby, i) in content.hobbies" :key="i">{{ hobby }}</span>
        </div>
      </div>

      <!-- 作品集 -->
      <div class="section" v-if="content.portfolio?.length">
        <div class="section-title">作品集</div>
        <div class="portfolio-list">
          <div v-for="p in content.portfolio" :key="p.id" class="portfolio-item">
            <span class="portfolio-title">{{ p.title }}</span>
            <a v-if="p.url" :href="p.url" class="portfolio-link">{{ p.url }}</a>
          </div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <div class="empty-hint" v-if="isEmpty">
        <p>开始编辑您的简历吧</p>
        <p class="hint-sub">在左侧填写信息，这里会实时预览效果</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CallOutline, MailOutline, LocationOutline } from '@vicons/ionicons5'
import type { ResumeContent } from '@/types'

const props = defineProps<{
  content: ResumeContent
}>()

const hasIntention = computed(() => {
  const i = props.content.intention
  return i.position || i.city || i.salary || i.jobType
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
</script>

<style lang="scss" scoped>
.resume-preview-container {
  padding: 20px;
}

.resume-page {
  background: #fff;
  padding: 40px;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  font-size: 12px;
  line-height: 1.6;
  color: #333;
  min-height: 297mm;
}

.resume-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #18a058;

  .header-left {
    .name {
      font-size: 26px;
      font-weight: 700;
      color: #18a058;
      margin-bottom: 4px;
    }

    .job-title {
      font-size: 13px;
      color: #666;
      margin-bottom: 10px;
    }

    .contact-info {
      display: flex;
      gap: 20px;
      color: #555;
      font-size: 13px;

      span {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

.section {
  margin-bottom: 18px;

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #18a058;
    padding-bottom: 6px;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
  }
}

.intention-info {
  display: flex;
  gap: 24px;
  color: #555;
  font-size: 13px;
}

.education-list, .work-list, .project-list, .training-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.education-item, .work-item, .project-item, .training-item {
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;

    .school, .company, .project-name, .institution {
      font-weight: 600;
      font-size: 14px;
      color: #222;
    }

    .date {
      color: #999;
      font-size: 12px;
    }
  }

  .item-sub {
    display: flex;
    gap: 16px;
    color: #666;
    font-size: 12px;
    margin-bottom: 4px;
  }

  .position, .role, .course {
    color: #555;
    font-size: 13px;
    margin-bottom: 4px;
  }

  .item-desc {
    color: #333;
    font-size: 13px;
    line-height: 1.8;
    margin-bottom: 4px;
  }

  .technologies {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 4px;
  }

  .achievements {
    list-style: disc;
    padding-left: 20px;

    li {
      font-size: 13px;
      line-height: 1.8;
      color: #333;
    }
  }
}

.awards-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.award-item {
  display: flex;
  align-items: center;
  gap: 16px;

  .award-name { font-weight: 500; font-size: 13px; }
  .award-meta { color: #666; font-size: 12px; }
  .award-date { color: #999; font-size: 12px; margin-left: auto; }
}

.skills-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.skill-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .skill-name { font-size: 13px; }

  .skill-level {
    display: flex;
    gap: 4px;

    .level-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #eee;

      &.active { background: #18a058; }
    }
  }
}

.languages-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 13px;
  color: #333;
}

.self-evaluation {
  font-size: 13px;
  line-height: 1.8;
  color: #333;
}

.hobbies-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: #333;

  span::after {
    content: '、';
    color: #ccc;
  }

  span:last-child::after {
    content: '';
  }
}

.portfolio-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.portfolio-item {
  display: flex;
  align-items: center;
  gap: 12px;

  .portfolio-title { font-weight: 500; font-size: 13px; }
  .portfolio-link { font-size: 12px; color: #18a058; text-decoration: none; }
}

.certificate {
  font-size: 12px;
  color: #666;
}

.empty-hint {
  text-align: center;
  padding: 80px 0;
  color: #bbb;

  p {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .hint-sub {
    font-size: 13px;
  }
}
</style>
