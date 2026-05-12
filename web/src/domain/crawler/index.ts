import ky from 'ky';
import { isEqual } from 'lodash-es';

import { WebNovelApi } from '@/api';
import type { WebNovelDto } from '@/model/WebNovel';
import { WebNovelRepo } from '@/repos';
import type { WebNovelMetadata } from '@auto-novel/crawler';
import {
  Alphapolis,
  Hameln,
  Kakuyomu,
  Novelup,
  Pixiv,
  Syosetu,
  WebNovelCrawler,
} from '@auto-novel/crawler';

const getCrawler = () => {
  if (!window.Addon) return undefined;
  const client = ky.create({ fetch: window.Addon.fetch });
  return new WebNovelCrawler({
    alphapolis: () => new Alphapolis(client),
    hameln: () => new Hameln(client),
    kakuyomu: () => new Kakuyomu(client),
    novelup: () => new Novelup(client),
    pixiv: () => new Pixiv(client),
    syosetu: () => new Syosetu(client, { concurrency: 2 }),
  });
};

const toMutationBody = (metadata: WebNovelMetadata) => ({
  title: metadata.title,
  authors: metadata.authors.map((author) => ({
    name: author.name,
    link: author.link ?? null,
  })),
  type: metadata.type,
  attentions: metadata.attentions,
  keywords: metadata.keywords,
  points: metadata.points ?? null,
  totalCharacters: metadata.totalCharacters,
  introduction: metadata.introduction,
  toc: metadata.toc.map((item) => ({
    title: item.title,
    chapterId: item.chapterId ?? null,
    createAt: item.createAt ?? null,
  })),
});

const toCurrentMutationBody = (novel: WebNovelDto) => ({
  title: novel.titleJp,
  authors: novel.authors.map((author) => ({
    name: author.name,
    link: author.link ?? null,
  })),
  type: novel.type as WebNovelMetadata['type'],
  attentions: novel.attentions as WebNovelMetadata['attentions'],
  keywords: novel.keywords,
  points: novel.points ?? null,
  totalCharacters: novel.totalCharacters ?? 0,
  introduction: novel.introductionJp,
  toc: novel.toc.map((item) => ({
    title: item.titleJp,
    chapterId: item.chapterId ?? null,
    createAt:
      item.createAt != null
        ? new Date(item.createAt * 1000).toISOString()
        : null,
  })),
});

const updateWebNovel = async (providerId: string, novelId: string) => {
  const crawler = getCrawler();
  if (!crawler) throw new Error('未检测到浏览器扩展');

  const metadata = await crawler.getMetadata(providerId, novelId);
  if (metadata == null) throw new Error('未找到小说');

  const body = toMutationBody(metadata);
  const current = await WebNovelApi.getNovel(providerId, novelId);
  if (isEqual(body, toCurrentMutationBody(current))) {
    throw new Error('没有必要更新');
  }

  await WebNovelRepo.updateNovel(providerId, novelId, body);
};

export const CrawlerService = {
  updateWebNovel,
};
