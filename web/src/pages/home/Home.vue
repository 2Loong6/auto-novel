<script lang="ts" setup>
import {
  BookOutlined,
  ForumOutlined,
  LanguageOutlined,
  ReadMoreOutlined,
  StarBorderOutlined,
} from '@vicons/material';

import { Locator } from '@/data';
import { WebNovelRepository, WenkuNovelRepository } from '@/data/api';
import bannerUrl from '@/image/banner.webp';
import { WebNovelOutlineDto } from '@/model/WebNovel';
import { WenkuNovelOutlineDto } from '@/model/WenkuNovel';
import { useBreakPoints } from '@/pages/util';
import { Result, runCatching } from '@/util/result';
import { WebUtil } from '@/util/web';

const bp = useBreakPoints();
const showShortcut = bp.smaller('tablet');

const router = useRouter();
const vars = useThemeVars();

const { whoami } = Locator.authRepository();

const url = ref('');
const query = (url: string) => {
  if (url.length === 0) return;
  const parseResult = WebUtil.parseUrl(url);
  if (parseResult !== undefined) {
    const { providerId, novelId } = parseResult;
    router.push({ path: `/novel/${providerId}/${novelId}` });
  } else {
    router.push({ path: '/novel', query: { query: url } });
  }
};

const favoriteList = ref<Result<WebNovelOutlineDto[]>>();
const loadFavorite = async () => {
  favoriteList.value = await runCatching(
    Locator.favoredRepository()
      .listFavoredWebNovel('default', {
        page: 0,
        pageSize: 8,
        query: '',
        provider: 'kakuyomu,syosetu,novelup,hameln,pixiv,alphapolis',
        type: 0,
        level: 0,
        translate: 0,
        sort: 'update',
      })
      .then((it) => it.items),
  );
};
loadFavorite();

const mostVisitedWeb = ref<Result<WebNovelOutlineDto[]>>();
const loadWeb = async () => {
  mostVisitedWeb.value = await runCatching(
    WebNovelRepository.listNovel({
      page: 0,
      pageSize: 8,
      provider: 'kakuyomu,syosetu,novelup,hameln,pixiv,alphapolis',
      sort: 1,
      level: 1,
    }).then((it) => it.items),
  );
};
loadWeb();

const latestUpdateWenku = ref<Result<WenkuNovelOutlineDto[]>>();
const loadWenku = async () => {
  latestUpdateWenku.value = await runCatching(
    WenkuNovelRepository.listNovel({
      page: 0,
      pageSize: 12,
      level: 1,
    }).then((it) => it.items),
  );
};
loadWenku();

const showHowToUseModal = ref(false);
const linkExample = [
  ['Kakuyomu', 'https://kakuyomu.jp/works/16817139555217983105'],
  [
    '成为小说家吧',
    'https://ncode.syosetu.com/n0833hi <br /> https://novel18.syosetu.com/n3192gh',
  ],
  ['Novelup', 'https://novelup.plus/story/206612087'],
  ['Hameln', 'https://syosetu.org/novel/297874/'],
  [
    'Pixiv系列/短篇',
    'https://www.pixiv.net/novel/series/9406879 <br/> https://www.pixiv.net/novel/show.php?id=18304868',
  ],
  ['Alphapolis', 'https://www.alphapolis.co.jp/novel/638978238/525733370'],
];

const showQQModal = ref(false);
const qqLink =
  'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=Qa0SOMBYZoJZ4vuykz3MbPS0zbpeN0pW&authKey=q75E7fr5CIBSDhqX%2F4kuC%2B0mcPiDvj%2FSDfP%2FGZ8Rl8kDn6Z3M6XPSZ91yt4ZWonq&noverify=0&group_code=819513328';

const telegramLink = 'https://t.me/+Mphy0wV4LYZkNTI1';
const githubLink = 'https://github.com/auto-novel/auto-novel';
</script>

<template>
  <div
    :style="{ background: `rgba(0, 0, 0, .25) url(${bannerUrl})` }"
    style="background-blend-mode: darken"
  >
    <div id="banner" class="layout-content">
      <n-h1
        style="
          text-align: center;
          font-size: 3em;
          color: white;
          filter: drop-shadow(0.05em 0.05em black);
        "
      >
        轻小说机翻机器人
      </n-h1>
      <n-input-group>
        <n-input
          v-model:value="url"
          size="large"
          placeholder="输入网络小说链接直接跳转，或搜索本站缓存..."
          :input-props="{ spellcheck: false }"
          @keyup.enter="query(url)"
          :style="{ 'background-color': vars.bodyColor }"
        />
        <n-button size="large" type="primary" @click="query(url)">
          搜索
        </n-button>
      </n-input-group>
    </div>
  </div>

  <div class="layout-content">
    <n-flex
      v-if="showShortcut"
      :size="0"
      justify="space-around"
      :wrap="false"
      style="margin: 8px 0px"
    >
      <router-link
        :to="whoami.isSignedIn ? '/favorite/web' : '/favorite/local'"
        style="flex: 1"
      >
        <n-button quaternary style="width: 100%; height: 64px">
          <n-flex align="center" vertical style="font-size: 12px">
            <n-icon size="24" :component="StarBorderOutlined" />
            我的收藏
          </n-flex>
        </n-button>
      </router-link>

      <router-link to="/novel" style="flex: 1">
        <n-button quaternary style="width: 100%; height: 64px">
          <n-flex align="center" vertical style="font-size: 12px">
            <n-icon size="24" :component="LanguageOutlined" />
            网络小说
          </n-flex>
        </n-button>
      </router-link>

      <router-link to="/wenku" style="flex: 1">
        <n-button quaternary style="width: 100%; height: 64px">
          <n-flex align="center" vertical style="font-size: 12px">
            <n-icon size="24" :component="BookOutlined" />
            文库小说
          </n-flex>
        </n-button>
      </router-link>

      <router-link to="/forum" style="flex: 1">
        <n-button quaternary style="width: 100%; height: 64px">
          <n-flex align="center" vertical style="font-size: 12px">
            <n-icon size="24" :component="ForumOutlined" />
            论坛
          </n-flex>
        </n-button>
      </router-link>
    </n-flex>
    <div v-else style="height: 16px" />

    <bulletin>
      <Migrate />
      <n-flex>
        <n-button text type="primary" @click="showHowToUseModal = true">
          使用说明
        </n-button>
        /
        <n-button text type="primary" @click="showQQModal = true">
          QQ群
        </n-button>
        /
        <n-a :href="telegramLink" target="_blank">Telegram</n-a>
        /
        <n-a :href="githubLink" target="_blank">Github</n-a>
      </n-flex>
      <n-p>
        禁止使用脚本绕过翻译器提交翻译文本，哪怕你觉得自己提交的是正经翻译。
      </n-p>
      <n-p>
        FishHawk长期996,网站开发速度大幅下降已成常态，论坛反馈目前没有精力维护，有问题加群@吧
      </n-p>
      <n-p>文件解析正在大改，如果出现小说文件相关问题，加群@FishHawk。</n-p>
    </bulletin>

    <template v-if="whoami.isSignedIn">
      <section-header title="我的收藏">
        <router-link to="/favorite/web">
          <c-button label="更多" :icon="ReadMoreOutlined" />
        </router-link>
      </section-header>
      <PanelWebNovel :list-result="favoriteList" />
      <n-divider />
    </template>

    <section-header title="网络小说-最多点击">
      <router-link to="/novel">
        <c-button label="更多" :icon="ReadMoreOutlined" />
      </router-link>
    </section-header>
    <PanelWebNovel :list-result="mostVisitedWeb" />
    <n-divider />

    <section-header title="文库小说-最新更新">
      <router-link to="/wenku">
        <c-button label="更多" :icon="ReadMoreOutlined" />
      </router-link>
    </section-header>
    <PanelWenkuNovel :list-result="latestUpdateWenku" />
    <n-divider />
  </div>

  <c-modal title="使用说明" v-model:show="showHowToUseModal">
    <n-p>
      将小说链接复制到网站首页的输入框里，点击搜索，如果链接正确，将会跳转到小说页面。更高级的用法，例如生成机翻、高级搜索等，参见
      <c-a to="/forum/64f3d63f794cbb1321145c07">使用教程</c-a>
      。有什么问题和建议请在
      <c-a to="/forum">论坛</c-a>
      中发帖讨论。
    </n-p>
    <n-p>支持的小说站如下:</n-p>
    <n-p v-for="[name, link] of linkExample" :key="name">
      <b>{{ name }}</b>
      <br />
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="link" />
    </n-p>
  </c-modal>

  <c-modal title="QQ群" v-model:show="showQQModal">
    <n-p>
      交流群：
      <n-a :href="qqLink" target="_blank">819513328</n-a>
      ，验证答案是“绿色”。
      <br />
      <n-qr-code :size="150" :value="qqLink" />
    </n-p>
  </c-modal>
</template>

<style scoped>
#banner {
  max-width: 800px;
  padding-top: 20px;
  padding-bottom: 50px;
}
@media only screen and (max-width: 600px) {
  #banner {
    padding-top: 10px;
    padding-bottom: 35px;
  }
}
</style>
