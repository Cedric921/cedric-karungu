import { Message } from '@/lib/models/Message';
import { Project } from '@/lib/models/Project';
import { Experience } from '@/lib/models/Experience';
import { Skill } from '@/lib/models/Skill';
import { SocialLink } from '@/lib/models/SocialLink';
import { SiteContent } from '@/lib/models/SiteContent';
import { ok } from '@/lib/api';
import { withAdmin } from '@/lib/handler';

export const GET = withAdmin(async () => {
  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const [
    messagesTotal,
    messagesUnread,
    messagesArchived,
    projectsTotal,
    experiencesTotal,
    skillsTotal,
    socialLinksTotal,
    contentTotal,
    perDayRaw,
    recentMessages,
  ] = await Promise.all([
    Message.countDocuments({}),
    Message.countDocuments({ read: false, archived: false }),
    Message.countDocuments({ archived: true }),
    Project.countDocuments({}),
    Experience.countDocuments({}),
    Skill.countDocuments({}),
    SocialLink.countDocuments({}),
    SiteContent.countDocuments({}),
    Message.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Message.find({}).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  // Fill missing days with 0 for a smooth chart
  const series: { date: string; count: number }[] = [];
  const map = new Map<string, number>(perDayRaw.map((d: { _id: string; count: number }) => [d._id, d.count]));
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    series.push({ date: key, count: map.get(key) || 0 });
  }

  return ok({
    counts: {
      messages: messagesTotal,
      messagesUnread,
      messagesArchived,
      projects: projectsTotal,
      experiences: experiencesTotal,
      skills: skillsTotal,
      socialLinks: socialLinksTotal,
      content: contentTotal,
    },
    messagesPerDay: series,
    recentMessages,
  });
});
