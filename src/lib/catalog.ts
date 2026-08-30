export type Cat = 'b' | 'm' | 'x';

export type Book = {
	i: string;
	t: string;
	s: string;
	c: Cat;
	p: number;
	a: number;
	h: string;
	d: string;
	l: string[];
	w: string;
};

export type Bundle = {
	i: string;
	t: string;
	s: string;
	a: number;
	m: string[];
};

export const author = {
	n: 'Michael Kekong',
	w: '2348164153030',
	d: '0816 415 3030'
};

export const cats: Record<Cat, { k: string; n: string; s: string }> = {
	b: { k: '01', n: 'the body', s: 'what grows quietly until it is an emergency' },
	m: { k: '02', n: 'the money', s: 'what leaves your account while you are working' },
	x: { k: '03', n: 'the exams', s: 'what the syllabus never says out loud' }
};

export const books: Book[] = [
	{
		i: 'killer-collection',
		t: 'The Silent Killer Collection 2.0',
		s: 'five health blueprints — heart, blood pressure, diabetes, liver, kidney — and the full body reset',
		c: 'b',
		p: 111,
		a: 450000,
		h: 'millions feel perfectly healthy until the day a silent disease changes everything.',
		d: 'the whole prevention series in one file. five complete blueprints, one organ at a time, each with the early warning signs people talk themselves out of, the everyday habits that cause the damage, and a four-week plan to turn it around. the bonus full-body reset runs the whole thing day by day.',
		l: [
			'series 1 — the heart: eight chapters on protecting it before it becomes an emergency',
			'series 2 — blood pressure: the one with no symptoms until there are',
			'series 3 — diabetes defence, with a four-week blood sugar plan',
			'series 4 — liver rescue, with a four-week reset',
			'series 5 — kidney protection, with a four-week plan',
			'bonus — the full body health reset plan, day by day',
			'four bonus resources'
		],
		w: 'anyone past thirty, anyone with it in the family, anyone who has never been tested.'
	},
	{
		i: 'killer-reset',
		t: 'The Silent Killer Reset',
		s: 'the simple blueprint for your heart, brain and lungs before chronic disease takes control',
		c: 'b',
		p: 33,
		a: 300000,
		h: 'chronic disease is not built overnight. it is built out of small daily decisions.',
		d: 'the shortest way in. three conditions that account for more deaths than anything else — heart disease, stroke, lower respiratory infection — explained plainly, with the warning signs your body gives months in advance and a thirty-day protection challenge you can actually finish.',
		l: [
			'the hidden truth about chronic disease',
			'heart disease: protecting the engine of life',
			'stroke: the warning your body may give you',
			'lower respiratory infections: protecting the breath of life',
			'the daily health reset system',
			'the health mistakes millions of people make',
			'the 30-day health protection challenge, week by week'
		],
		w: 'start here if you have never read a health book in your life.'
	},
	{
		i: 'ai-cashflow',
		t: 'AI Cashflow Blueprint',
		s: 'turning free ai tools into daily income — no coding, no tech skills, no big capital',
		c: 'm',
		p: 86,
		a: 300000,
		h: 'ai is not the business. ai is the worker. you are the business owner.',
		d: 'most ai books explain how ai works. nobody is asking that. people are asking what they can sell this week. this one skips the history and the jargon and goes straight to income you can start with chatgpt and claude, using the free tiers, from a phone if that is what you have.',
		l: [
			'why "learn ai" is the wrong goal, and what to do instead',
			'income opportunities you can start this week',
			'what to sell, who to sell it to, and what to charge',
			'the exact prompts, not the theory',
			'written for school leavers, graduates, undergraduates, hustlers and stay-at-home parents'
		],
		w: 'you want money this month, not another certificate.'
	},
	{
		i: 'ai-cashflow-2',
		t: 'AI Cashflow Blueprint 2.0',
		s: 'the premium toolkit — 25 side hustles, 1,000 prompts, templates, automations, a 30-day challenge',
		c: 'm',
		p: 38,
		a: 450000,
		h: 'the 2.0 is not more reading. it is the assets.',
		d: 'ten parts and seven bonuses of things you use rather than things you read. the side hustles are costed and scripted, the prompts are ready to paste, the templates are ready to send, and the thirty-day challenge tells you what to do each morning.',
		l: [
			'part 4 — 25 ai side hustles that actually work',
			'part 5 — the ai business blueprint',
			'part 6 — the ultimate prompt library',
			'part 7 — ready-to-use business templates',
			'part 8 — the automation toolkit',
			'part 9 — making money with chatgpt',
			'part 10 — marketing like a pro',
			'bonuses: 100 business ideas · 1,000 prompts · starter kit · income tracker · resource vault · video companion · the 30-day challenge'
		],
		w: 'you already believe in ai. you want the toolkit.'
	},
	{
		i: 'silent-poverty',
		t: 'Silent Poverty',
		s: 'why employed people are still broke, and the five income leaks draining your future',
		c: 'm',
		p: 21,
		a: 200000,
		h: 'you are paid every month and you are still not building anything. that is a leak, not bad luck.',
		d: 'silent poverty is having a job, looking fine, and being one unexpected expense away from trouble. this names the five leaks doing it — and gives a thirty-day reset that starts with awareness and ends with a second income layer.',
		l: [
			'the salary illusion, and the pressure to appear stable',
			'why employment alone is no longer enough',
			'leak 1 — the salary-only mindset',
			'leak 2 — lifestyle inflation',
			'leak 3 — social and family financial pressure',
			'leak 4 — invisible digital spending',
			'leak 5 — no financial awareness',
			'the 30-day financial reset plan'
		],
		w: 'civil servants, 9–5 workers, young graduates, nysc members, stay-at-home mums.'
	},
	{
		i: 'digital-skill',
		t: 'The Digital Skill Nobody Is Teaching In School',
		s: 'the skills quietly paying in dollars while the classroom teaches something else',
		c: 'm',
		p: 49,
		a: 250000,
		h: 'you did everything they told you to do. that was the problem.',
		d: 'a wake-up call for anyone holding a certificate and no direction. it explains why the job market stopped matching the curriculum, which digital skills are actually being paid for right now, and how to pick one and get your first payment — in practical steps, not motivation.',
		l: [
			'the degree illusion — why so many graduates struggle',
			'the harsh reality facing graduates today',
			'the digital skills creating opportunity right now',
			'how to choose one instead of collecting five',
			'how to get paid for it the first time',
			'practical steps, not motivation'
		],
		w: 'students, undergraduates and graduates who suspect they were handed the wrong map.'
	},
	{
		i: 'jamb',
		t: 'JAMB Mastery Blueprint',
		s: 'proven strategies to score high, with the full 2026/2027 syllabus for every required subject',
		c: 'x',
		p: 48,
		a: 200000,
		h: 'past questions repeat. frequency is a map. almost nobody reads it.',
		d: 'the updated syllabus and the method in one file. it teaches the three-step system — past questions, then frequency, then priority — then hands you a thirty-day plan split into foundation, practice and simulation, and names the study myths that quietly cost candidates their score.',
		l: [
			'the updated 2026/2027 syllabus: english, mathematics, physics, chemistry, biology, economics and more',
			'the real problem, and the mindset shift',
			'past questions → frequency → priority: the three-step method',
			'the 30-day plan: foundation, practice, simulation',
			'the psychology of the exam hall',
			'subject-specific strategies',
			'what does not work — the myths, named',
			'a sample study timetable and the practical tools'
		],
		w: 'anyone sitting jamb in 2026 or 2027, and the parents paying for it.'
	},
	{
		i: 'panic-300',
		t: 'From Panic to 300+',
		s: 'from panic to 300+ — the calm system for turning jamb fear into a focused, high score',
		c: 'x',
		p: 36,
		a: 200000,
		h: 'panic is not a lack of intelligence. it is a lack of system.',
		d: 'the missing piece between jamb mastery and the exam hall. it teaches how to stop spiralling, how to turn the syllabus into a daily plan you can actually finish, and how to walk into the hall ready instead of rattled — with the same three-step method: past questions, frequency, priority, now taught as a calm 30-day execution.',
		l: [
			'the panic loop and how to break it',
			'turning the full 2026/2027 syllabus into a daily plan',
			'past questions → frequency → priority, taught calmly',
			'the 30-day execution: foundation, practice, simulation',
			'the psychology of scoring 300+ without burning out',
			'what to ignore, what to double down on'
		],
		w: 'anyone who freezes at the word jamb and wants 300+ without cramming.'
	},
	{
		i: 'waec',
		t: 'WAEC A+ Blueprint',
		s: 'a 90-day toolkit for excellent grades without stress, confusion or last-minute panic',
		c: 'x',
		p: 42,
		a: 200000,
		h: 'students do not fail waec for being unintelligent. they fail because nobody showed them how marks are awarded.',
		d: 'most waec material tells students to read harder. this one sells the system: how examiners award marks, how to study less and remember more, how to turn a weak subject into a passable one, and a ninety-day plan that ends with a student who is ready instead of frightened.',
		l: [
			'the waec success mindset',
			'the smart reading system: study less, remember more',
			'the exam strategy most students ignore',
			'past questions: the secret weapon of waec champions',
			'the 90-day plan: build, practise, revise',
			'the exam room winning strategy',
			'a parents’ guide',
			'the a+ student toolkit'
		],
		w: 'ss3 students, resit candidates, and the parents paying for it.'
	}
];

export const bundles: Bundle[] = [
	{
		i: 'bundle-all',
		t: 'The Whole Library',
		s: 'all nine blueprints — the body, the money and the exams — at half of what they cost apart',
		a: 1350000,
		m: [
			'killer-collection',
			'killer-reset',
			'ai-cashflow',
			'ai-cashflow-2',
			'silent-poverty',
			'digital-skill',
			'jamb',
			'waec',
			'panic-300'
		]
	},
	{
		i: 'bundle-body',
		t: 'The Body',
		s: 'the full prevention series and the reset that starts it',
		a: 550000,
		m: ['killer-collection', 'killer-reset']
	},
	{
		i: 'bundle-money',
		t: 'The Money',
		s: 'both ai toolkits, the leaks that drain a salary, and the skills nobody taught you',
		a: 750000,
		m: ['ai-cashflow', 'ai-cashflow-2', 'silent-poverty', 'digital-skill']
	},
	{
		i: 'bundle-exams',
		t: 'The Exams',
		s: 'jamb and waec and panic to 300+, the syllabus and the system',
		a: 500000,
		m: ['jamb', 'waec', 'panic-300']
	}
];

export function book(i: string): Book | undefined {
	return books.find((b) => b.i === i);
}

export function bundle(i: string): Bundle | undefined {
	return bundles.find((u) => u.i === i);
}

export function by_cat(c: Cat): Book[] {
	return books.filter((b) => b.c === c);
}

export function list_price(u: Bundle): number {
	return u.m.reduce((n, i) => n + (book(i)?.a ?? 0), 0);
}

export function item(i: string): { t: string; a: number; f: string[] } | undefined {
	const b = book(i);
	if (b) return { t: b.t, a: b.a, f: [b.i] };
	const u = bundle(i);
	if (u) return { t: u.t, a: u.a, f: u.m };
	return undefined;
}

export function naira(kobo: number): string {
	return '₦' + Math.round(kobo / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
