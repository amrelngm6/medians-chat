<?php

namespace Database\Seeders;

use App\Models\ContentSection;
use App\Models\ContentSectionTranslation;
use Illuminate\Database\Seeder;

class PersonalContentSeeder extends Seeder
{
    /**
     * Translations keyed by section_key → locale → translatable fields.
     *
     * Only text that changes between languages lives here.
     * Non-translatable fields (icons, image paths, URLs, style classes …)
     * are kept in the shared structure below and merged at seed time.
     */
    private array $translations = [

        // ── INTRO ────────────────────────────────────────────────────────────
        'intro' => [
            'en' => [
                'greeting'          => 'Hello!',
                'title'             => 'Web Developer',
                'imageAlt'          => 'Amr Ewis',
                'heroSummaryText'   => 'Amr is the secret weapon for any modern SaaS, he transformed our complex ideas into a high performance reality.',
                'heroSummaryAuthor' => 'Marc Hawkins - Adobe Director',
                'buttons'           => [
                    ['label' => 'More About Me'],
                    ['label' => 'See My Work'],
                ],
            ],
            'ar' => [
                'greeting'          => 'مرحباً!',
                'title'             => 'مطوّر ويب',
                'imageAlt'          => 'عمرو عويس',
                'heroSummaryText'   => 'ديفيد هو السلاح السري لأي منتج SaaS حديث، لقد حوّل أفكارنا المعقدة إلى واقع عالي الأداء.',
                'heroSummaryAuthor' => 'مارك هوكينز - مدير Adobe',
                'buttons'           => [
                    ['label' => 'المزيد عني'],
                    ['label' => 'أعمالي'],
                ],
            ],
        ],

        // ── ABOUT ────────────────────────────────────────────────────────────
        'about' => [
            'en' => [
                'bio'   => 'I\'m a frontend developer passionate about building clean, intuitive interfaces and meaningful <strong>digital experiences</strong> that people enjoy using.',
                'stats' => [
                    ['text' => '9+ Years in Web Development'],
                    ['text' => '62+ Completed Projects'],
                    ['text' => '55+ Happy Customers'],
                    ['text' => 'Available for Freelance'],
                    ['text' => 'Based in London, UK'],
                ],
                'buttons' => [
                    ['label' => 'View My Skills'],
                    ['label' => 'View My Projects'],
                ],
                'triggers' => 'about, about me, about you, who are you, profile, bio, biography, introduction, who, you, me',
            ],
            'ar' => [
                'bio'   => 'أنا مطوّر واجهات أمامية شغوف ببناء واجهات نظيفة وبديهية وتجارب <strong>رقمية ذات معنى</strong> يستمتع الناس باستخدامها.',
                'stats' => [
                    ['text' => '+9 سنوات في تطوير الويب'],
                    ['text' => '+62 مشروعاً مكتملاً'],
                    ['text' => '+55 عميلاً سعيداً'],
                    ['text' => 'متاح للعمل الحر'],
                    ['text' => 'مقيم في لندن، المملكة المتحدة'],
                ],
                'buttons' => [
                    ['label' => 'مهاراتي'],
                    ['label' => 'مشاريعي'],
                ],
                'triggers' => 'عني, من أنت, ملف شخصي, سيرة ذاتية, مقدمة',
            ],
        ],

        // ── SKILLS ───────────────────────────────────────────────────────────
        'skills' => [
            'en' => [
                'intro'      => 'Here are the tools and technologies I use daily to build reliable, modern interfaces with a strong focus on <strong>quality and performance.</strong>',
                'categories' => [
                    ['name' => 'Frontend'],
                    ['name' => 'Backend'],
                ],
                'buttons' => [
                    ['label' => 'View My Projects'],
                    ['label' => 'Download CV'],
                ],
                'triggers' => 'skills, technologies, stack, tech, tools, what can you do, capabilities, show me your skills, what are you good at',
            ],
            'ar' => [
                'intro'      => 'إليك الأدوات والتقنيات التي أستخدمها يومياً لبناء واجهات حديثة وموثوقة مع تركيز قوي على <strong>الجودة والأداء.</strong>',
                'categories' => [
                    ['name' => 'الواجهة الأمامية'],
                    ['name' => 'الواجهة الخلفية'],
                ],
                'buttons' => [
                    ['label' => 'عرض مشاريعي'],
                    ['label' => 'تحميل السيرة الذاتية'],
                ],
                'triggers' => 'مهارات, تقنيات, أدوات, ما الذي تجيده',
            ],
        ],

        // ── PROJECTS ─────────────────────────────────────────────────────────
        'projects' => [
            'en' => [
                'intro' => 'Ready to view my recent work? I\'ll walk you through my projects one at a time. Click <strong>Show Next Project</strong> below to keep going.',
                'items' => [
                    ['title' => 'Gallery Project',   'summary' => 'Interactive e-commerce website with multiple product views and zoom features built with React and Node js.'],
                    ['title' => 'YouTube Project',   'summary' => 'A short video showcasing the concept, key features, and the overall user experience in action.'],
                    ['title' => 'Image Project',     'summary' => 'Interactive e-commerce website with multiple product views and zoom features built with React and Node js.'],
                    ['title' => 'MP4 Video Project', 'summary' => 'A launch video presenting the product vision, core features, and the experience delivered to users.'],
                ],
                'globalButtons' => [['label' => 'View My Clients']],
                'finalButtons'  => [
                    ['label' => 'View My Clients'],
                    ['label' => 'Contact Me'],
                ],
                'triggers' => 'projects, portfolio, work, examples, case studies, show me, builds, apps, websites, creations, show me your work',
            ],
            'ar' => [
                'intro' => 'هل أنت مستعد لمشاهدة أعمالي الأخيرة؟ سأرشدك عبر مشاريعي واحداً تلو الآخر. انقر على <strong>عرض المشروع التالي</strong> للمتابعة.',
                'items' => [
                    ['title' => 'مشروع معرض الصور', 'summary' => 'موقع تجارة إلكترونية تفاعلي مع عروض متعددة للمنتجات وميزات التكبير، مبني باستخدام React و Node.js.'],
                    ['title' => 'مشروع يوتيوب',     'summary' => 'مقطع فيديو قصير يعرض المفهوم والميزات الرئيسية وتجربة المستخدم الشاملة.'],
                    ['title' => 'مشروع صورة',        'summary' => 'موقع تجارة إلكترونية تفاعلي مع عروض متعددة للمنتجات وميزات التكبير، مبني باستخدام React و Node.js.'],
                    ['title' => 'مشروع فيديو MP4',   'summary' => 'فيديو إطلاق يعرض رؤية المنتج والميزات الأساسية والتجربة المقدمة للمستخدمين.'],
                ],
                'globalButtons' => [['label' => 'عرض العملاء']],
                'finalButtons'  => [
                    ['label' => 'عرض العملاء'],
                    ['label' => 'تواصل معي'],
                ],
                'triggers' => 'مشاريع, أعمال, محفظة, أمثلة',
            ],
        ],

        // ── SERVICES ─────────────────────────────────────────────────────────
        'services' => [
            'en' => [
                'intro' => 'I am providing top-notch services to meet your needs. Click on <strong>View My Services</strong> to explore what I offer.',
                'items' => [
                    [
                        'title' => 'Web Development',   
                        'summary' => 'Building responsive and interactive websites tailored to your needs using modern technologies.'
                    ],
                    ['title' => 'Mobile App Development',   'summary' => 'Creating user-friendly mobile applications for both iOS and Android platforms.'],
                    ['title' => 'UI/UX Design',     'summary' => 'Designing intuitive and visually appealing user interfaces and experiences.'],
                    ['title' => 'Digital Marketing', 'summary' => 'Implementing effective digital marketing strategies to enhance your online presence.'],
                ],
                'globalButtons' => [['label' => 'View My Clients']],
                'finalButtons'  => [
                    ['label' => 'View My Clients'],
                    ['label' => 'Contact Me'],
                ],
                'triggers' => 'services, offerings, what you offer, solutions, expertise',
            ],
            'ar' => [
                'intro' => 'أنا أقدم خدمات عالية الجودة لتلبية احتياجاتك. انقر على <strong>عرض خدماتي</strong> لاستكشاف ما أقدمه.',
                'items' => [
                    ['title' => 'تطوير الويب',   'summary' => 'بناء مواقع ويب تفاعلية ومتجاوبة مصممة خصيصًا لتلبية احتياجاتك باستخدام تقنيات حديثة.'],
                    ['title' => 'تطوير تطبيقات الجوال',   'summary' => 'إنشاء تطبيقات جوال سهلة الاستخدام لكل من منصات iOS و Android.'],
                    ['title' => 'تصميم واجهة المستخدم وتجربة المستخدم',     'summary' => 'تصميم واجهات وتجارب مستخدم بديهية وجذابة بصريًا.'],
                    ['title' => 'التسويق الرقمي',   'summary' => 'تنفيذ استراتيجيات تسويق رقمي فعالة لتعزيز وجودك على الإنترنت.'],
                ],
                'globalButtons' => [['label' => 'عرض المشاريع']],
                'finalButtons'  => [
                    ['label' => 'تواصل معي'],
                ],
                'triggers' => 'خدمات, عروض, ما تقدمه, حلول, خبرة',
            ],
        ],

        // ── CLIENTS ──────────────────────────────────────────────────────────
        'clients' => [
            'en' => [
                'intro'   => 'I\'ve had the pleasure of working with some <strong>amazing companies and brands</strong> over the years, here are a few of them :',
                'buttons' => [
                    ['label' => 'Contact Me'],
                    ['label' => 'Download CV'],
                ],
                'triggers' => 'clients, brands, partners, customers, collaborations',
            ],
            'ar' => [
                'intro'   => 'تشرّفت بالعمل مع بعض <strong>الشركات والعلامات التجارية الرائعة</strong> على مر السنين، إليك بعضها:',
                'buttons' => [
                    ['label' => 'تواصل معي'],
                    ['label' => 'تحميل السيرة الذاتية'],
                ],
                'triggers' => 'عملاء, شركاء, علامات تجارية',
            ],
        ],

        // ── CONTACT ──────────────────────────────────────────────────────────
        'contact' => [
            'en' => [
                'intro'         => 'I\'m always open to new projects, creative ideas and <strong>opportunities</strong>. Feel free to get in touch through any of the channels below.',
                'directContact' => [
                    ['label' => 'Email :'],
                    ['label' => 'Phone :'],
                ],
                'buttons' => [
                    ['label' => 'Send Me a Message'],
                    ['label' => 'View Projects'],
                ],
                'triggers' => 'contact, touch, reach, message, hire, email, message, reach, call',
            ],
            'ar' => [
                'intro'         => 'أنا دائماً منفتح على المشاريع الجديدة والأفكار الإبداعية و<strong>الفرص</strong>. لا تتردد في التواصل معي عبر أي من القنوات أدناه.',
                'directContact' => [
                    ['label' => 'البريد الإلكتروني:'],
                    ['label' => 'الهاتف:'],
                ],
                'buttons' => [
                    ['label' => 'أرسل لي رسالة'],
                    ['label' => 'عرض المشاريع'],
                ],
                'triggers' => 'تواصل, رسالة, تعاون, توظيف, بريد إلكتروني',
            ],
        ],

        // ── HELLO ────────────────────────────────────────────────────────────
        'hello' => [
            'en' => [
                'blocks' => [
                    ['tag' => 'P', 'content' => 'Hi there I\'m <strong>Amr Ewis !</strong>'],
                    ['tag' => 'P', 'content' => 'Please use the following commands to learn more about my journey :'],
                    ['tag' => 'P', 'content' => '<strong>about</strong>, <strong>skills</strong>, <strong>projects</strong>, <strong>clients</strong>, <strong>contact</strong>.'],
                ],
                'triggers' => 'hi, hello, hey, greeting, yo',
            ],
            'ar' => [
                'blocks' => [
                    ['tag' => 'P', 'content' => 'مرحباً، أنا <strong>عمرو عويس!</strong>'],
                    ['tag' => 'P', 'content' => 'يمكنك استخدام الأوامر التالية لمعرفة المزيد عن مسيرتي:'],
                    ['tag' => 'P', 'content' => '<strong>عني</strong>، <strong>مهارات</strong>، <strong>مشاريع</strong>، <strong>عملاء</strong>، <strong>تواصل</strong>.'],
                ],
                'triggers' => 'مرحبا, أهلاً, هلا, السلام عليكم',
            ],
        ],

        // ── HOBBIES ──────────────────────────────────────────────────────────
        'hobbies' => [
            'en' => [
                'blocks' => [
                    ['tag' => 'P', 'content' => 'Beyond coding, I like to keep my mind and body active with these activities:'],
                    [
                        'tag'   => 'DIV',
                        'items' => [
                            '<i class="fas fa-camera"></i> <strong>Photography</strong> — Capturing urban landscapes and nature.',
                            '<i class="fas fa-plane"></i> <strong>Traveling</strong> — Exploring new cultures and cuisines.',
                            '<i class="fas fa-dumbbell"></i> <strong>Fitness</strong> — Hitting the gym to stay energized.',
                            '<i class="fas fa-gamepad"></i> <strong>Gaming</strong> — Love immersive RPGs and strategy games.',
                            '<i class="fas fa-headphones"></i> <strong>Music</strong> — Lo-fi beats while coding and rock for the road.',
                            '<i class="fas fa-futbol"></i> <strong>Football</strong> — Playing in local leagues and following the beautiful game.',
                        ],
                    ],
                    ['tag' => 'P', 'content' => 'Do you share any of these interests?'],
                ],
                'buttons' => [
                    ['label' => 'Let\'s Connect'],
                    ['label' => 'More About Me'],
                ],
                'triggers' => 'hobbies, interests, fun, life, leisure',
            ],
            'ar' => [
                'blocks' => [
                    ['tag' => 'P', 'content' => 'خارج نطاق البرمجة، أحب إبقاء عقلي وجسدي نشيطَين من خلال هذه الأنشطة:'],
                    [
                        'tag'   => 'DIV',
                        'items' => [
                            '<i class="fas fa-camera"></i> <strong>التصوير الفوتوغرافي</strong> — التقاط مناظر المدن والطبيعة.',
                            '<i class="fas fa-plane"></i> <strong>السفر</strong> — استكشاف ثقافات ومأكولات جديدة.',
                            '<i class="fas fa-dumbbell"></i> <strong>اللياقة البدنية</strong> — التردد على الصالة الرياضية للحفاظ على الطاقة.',
                            '<i class="fas fa-gamepad"></i> <strong>ألعاب الفيديو</strong> — أحب ألعاب RPG والاستراتيجية.',
                            '<i class="fas fa-headphones"></i> <strong>الموسيقى</strong> — موسيقى Lo-fi أثناء البرمجة وروك في الطريق.',
                            '<i class="fas fa-futbol"></i> <strong>كرة القدم</strong> — اللعب في الدوريات المحلية ومتابعة اللعبة الجميلة.',
                        ],
                    ],
                    ['tag' => 'P', 'content' => 'هل تشاركني أياً من هذه الاهتمامات؟'],
                ],
                'buttons' => [
                    ['label' => 'لنتواصل'],
                    ['label' => 'المزيد عني'],
                ],
                'triggers' => 'هوايات, اهتمامات, ترفيه, حياة',
            ],
        ],

        // ── AGE ──────────────────────────────────────────────────────────────
        'age' => [
            'en' => [
                'blocks' => [
                    ['tag' => 'P', 'content' => 'I was born on March 15, 1999 in London, UK. I am currently <strong>27 years old</strong> and based in London.'],
                ],
                'buttons' => [
                    ['label' => 'More About Me'],
                    ['label' => 'Download CV'],
                ],
                'triggers' => 'age, old, how old are you, your age, born, birthdate, born',
            ],
            'ar' => [
                'blocks' => [
                    ['tag' => 'P', 'content' => 'وُلدت في 15 مارس 1999 في لندن، المملكة المتحدة. عمري حالياً <strong>27 عاماً</strong> وأقيم في لندن.'],
                ],
                'buttons' => [
                    ['label' => 'المزيد عني'],
                    ['label' => 'تحميل السيرة الذاتية'],
                ],
                'triggers' => 'العمر, كم عمرك, تاريخ الميلاد',
            ],
        ],

        // ── CV ───────────────────────────────────────────────────────────────
        'cv' => [
            'en' => [
                'blocks' => [
                    ['tag' => 'P', 'content' => 'Absolutely! Here is my complete <strong>curriculum vitae.</strong>'],
                    ['tag' => 'P', 'content' => 'Click the button below to download the PDF file.'],
                ],
                'buttons' => [
                    ['label' => 'Download CV'],
                ],
                'triggers' => 'cv, curriculum vitae, resume, your cv',
            ],
            'ar' => [
                'blocks' => [
                    ['tag' => 'P', 'content' => 'بالتأكيد! إليك سيرتي الذاتية <strong>الكاملة.</strong>'],
                    ['tag' => 'P', 'content' => 'انقر على الزر أدناه لتحميل ملف PDF.'],
                ],
                'buttons' => [
                    ['label' => 'تحميل السيرة الذاتية'],
                ],
                'triggers' => 'سيرة ذاتية, cv',
            ],
        ],

        // ── EDUCATION ────────────────────────────────────────────────────────
        'education' => [
            'en' => [
                'blocks' => [
                    ['tag' => 'P', 'content' => 'I graduated with a <strong>BS in Computer Science</strong> from London University in 2015,'],
                    ['tag' => 'P', 'content' => 'You can find more detailed information about my academic journey in my <strong>CV.</strong>'],
                ],
                'buttons' => [
                    ['label' => 'Download CV'],
                    ['label' => 'More About Me'],
                ],
                'triggers' => 'education, university, degrees, studies, academic, graduation, diploma',
            ],
            'ar' => [
                'blocks' => [
                    ['tag' => 'P', 'content' => 'تخرّجت بدرجة <strong>بكالوريوس في علوم الحاسوب</strong> من جامعة لندن عام 2015،'],
                    ['tag' => 'P', 'content' => 'يمكنك العثور على مزيد من المعلومات التفصيلية حول مسيرتي الأكاديمية في <strong>سيرتي الذاتية.</strong>'],
                ],
                'buttons' => [
                    ['label' => 'تحميل السيرة الذاتية'],
                    ['label' => 'المزيد عني'],
                ],
                'triggers' => 'تعليم, جامعة, دراسة, تخرج, شهادة',
            ],
        ],

        // ── EXPERIENCE ───────────────────────────────────────────────────────
        'experience' => [
            'en' => [
                'blocks' => [
                    ['tag' => 'P', 'content' => 'I am currently working as a Senior <strong>Full-Stack Developer</strong> at <strong>TechVision Solutions,</strong> I joined the team in October 2021, where I lead the development of intuitive user interfaces.'],
                    ['tag' => 'P', 'content' => 'You can find a comprehensive timeline of my entire professional journey by downloading my full CV below.'],
                ],
                'buttons' => [
                    ['label' => 'Download CV'],
                    ['label' => 'View My Projects'],
                ],
                'triggers' => 'experience, career',
            ],
            'ar' => [
                'blocks' => [
                    ['tag' => 'P', 'content' => 'أعمل حالياً كـ<strong>مطوّر Full-Stack أول</strong> في <strong>TechVision Solutions</strong>، انضممت إلى الفريق في أكتوبر 2021، حيث أقود تطوير واجهات مستخدم بديهية.'],
                    ['tag' => 'P', 'content' => 'يمكنك العثور على جدول زمني شامل لمسيرتي المهنية بالكامل عن طريق تحميل سيرتي الذاتية أدناه.'],
                ],
                'buttons' => [
                    ['label' => 'تحميل السيرة الذاتية'],
                    ['label' => 'عرض مشاريعي'],
                ],
                'triggers' => 'خبرة, مسيرة مهنية, عمل',
            ],
        ],

        // ── AWARDS ───────────────────────────────────────────────────────────
        'awards' => [
            'en' => [
                'blocks' => [
                    ['tag' => 'P',  'content' => 'I am committed to <strong>continuous learning</strong> and staying updated with industry standards, here is a list of the <strong>awards</strong> I received in recent years:'],
                    ['tag' => 'UL', 'items'   => [
                        'AWS Solutions Architect',
                        'Google Cloud Developer',
                        'Meta Front-End Specialization',
                    ]],
                ],
                'buttons' => [
                    ['label' => 'Download CV'],
                    ['label' => 'View My Projects'],
                ],
                'triggers' => 'awards, certificates, courses, training, certifications',
            ],
            'ar' => [
                'blocks' => [
                    ['tag' => 'P',  'content' => 'أنا ملتزم بـ<strong>التعلم المستمر</strong> ومواكبة معايير الصناعة، إليك قائمة بـ<strong>الجوائز</strong> التي حصلت عليها في السنوات الأخيرة:'],
                    ['tag' => 'UL', 'items' => [
                        'AWS Solutions Architect',
                        'Google Cloud Developer',
                        'Meta Front-End Specialization',
                    ]],
                ],
                'buttons' => [
                    ['label' => 'تحميل السيرة الذاتية'],
                    ['label' => 'عرض مشاريعي'],
                ],
                'triggers' => 'جوائز, شهادات, دورات, تدريب',
            ],
        ],

        // ── MSG_SUCCESS ───────────────────────────────────────────────────────
        'msg_success' => [
            'en' => [
                'blocks' => [
                    ['tag' => 'P', 'content' => '<strong>Your message was sent successfully!</strong>'],
                    ['tag' => 'P', 'content' => 'Rest assured, I\'ll be in touch with a proper response within 24 hours.'],
                ],
                'buttons' => [
                    ['label' => 'View My Projects'],
                    ['label' => 'See my Hobbies'],
                ],
                'triggers' => '',
            ],
            'ar' => [
                'blocks' => [
                    ['tag' => 'P', 'content' => '<strong>تم إرسال رسالتك بنجاح!</strong>'],
                    ['tag' => 'P', 'content' => 'لا تقلق، سأتواصل معك بردٍّ مناسب خلال 24 ساعة.'],
                ],
                'buttons' => [
                    ['label' => 'عرض مشاريعي'],
                    ['label' => 'هواياتي'],
                ],
                'triggers' => '',
            ],
        ],

        // ── ERROR ────────────────────────────────────────────────────────────
        'error' => [
            'en' => [
                'blocks' => [
                    ['tag' => 'P', 'content' => 'I\'m sorry, I didn\'t quite catch that. Try one of these commands:'],
                    ['tag' => 'P', 'content' => '<strong>about</strong>, <strong>skills</strong>, <strong>projects</strong>, <strong>clients</strong>, <strong>contact</strong>.'],
                ],
                'buttons'  => [],
                'triggers' => '',
            ],
            'ar' => [
                'blocks' => [
                    ['tag' => 'P', 'content' => 'عذراً، لم أفهم ذلك جيداً. جرّب أحد هذه الأوامر:'],
                    ['tag' => 'P', 'content' => '<strong>عني</strong>، <strong>مهارات</strong>، <strong>مشاريع</strong>، <strong>عملاء</strong>، <strong>تواصل</strong>.'],
                ],
                'buttons'  => [],
                'triggers' => '',
            ],
        ],
    ];

    /**
     * Locale-agnostic data merged into every translation.
     * Structured fields (icons, paths, URLs, ratings …) live here once.
     */
    private array $sharedData = [

        'intro' => [
            'name'     => 'Amr',
            'imageUrl' => 'img/avatar-intro.png',
            'buttons'  => [
                ['action' => 'about',     'styleClass' => ''],
                ['action' => 'portfolio', 'styleClass' => 'btn-secondary'],
            ],
        ],

        'about' => [
            'stats' => [
                ['icon' => 'fa-regular fa-star'],
                ['icon' => 'fa-solid fa-code'],
                ['icon' => 'fa-regular fa-face-grin-wide'],
                ['icon' => 'fa-regular fa-calendar-check'],
                ['icon' => 'fa-regular fa-map'],
            ],
            'buttons' => [
                ['action' => 'skills',   'styleClass' => ''],
                ['action' => 'projects', 'styleClass' => 'btn-secondary'],
            ],
        ],

        'skills' => [
            'categories' => [
                [
                    'icon'   => 'fa-solid fa-laptop',
                    'skills' => [
                        ['name' => 'HTML',       'rating' => 5],
                        ['name' => 'Javascript', 'rating' => 3],
                        ['name' => 'PHP',        'rating' => 4],
                        ['name' => 'jQuery',     'rating' => 5],
                    ],
                ],
                [
                    'icon'   => 'fa-solid fa-database',
                    'skills' => [
                        ['name' => 'Node.js', 'rating' => 5],
                        ['name' => 'Python',  'rating' => 4],
                        ['name' => 'Java',    'rating' => 5],
                    ],
                ],
            ],
            'buttons' => [
                ['action' => '',     'link' => '',               'styleClass' => ''],
                ['action' => '',     'link' => 'link-to-cv.pdf', 'styleClass' => 'btn-secondary'],
            ],
        ],

        'projects' => [
            'items' => [
                [
                    'link'      => 'https://link-to-your-website.com',
                    'image'     => 'img/projects/project-1.jpg',
                    'mediaType' => 'gallery',
                    'gallery'   => [
                        'img/projects/project-1-big.jpg',
                        'img/projects/project-2-big.jpg',
                        'img/projects/project-3-big.jpg',
                    ],
                ],
                [
                    'link'      => 'https://link-to-your-website.com',
                    'image'     => 'img/projects/project-2.jpg',
                    'mediaType' => 'youtube',
                    'youtubeId' => 'SjJhuZQlkbA',
                ],
                [
                    'link'      => '',
                    'image'     => 'img/projects/project-3.jpg',
                    'mediaType' => 'image',
                ],
                [
                    'link'      => 'https://link-to-your-website.com',
                    'image'     => 'img/projects/project-4.jpg',
                    'mediaType' => 'video',
                    'videoUrl'  => 'img/video.mp4',
                ],
            ],
            'globalButtons' => [
                ['action' => 'clients', 'styleClass' => 'btn-secondary'],
            ],
            'finalButtons' => [
                ['action' => 'clients', 'styleClass' => ''],
                ['action' => 'contact', 'styleClass' => 'btn-secondary'],
            ],
        ],
        

        'services' => [
            'items' => [
                [
                    'link'      => 'https://link-to-your-website.com',
                    'image'     => 'img/services/service-1.jpg',
                    'mediaType' => 'gallery',
                    'gallery'   => [
                        'img/services/service-1-big.jpg',
                        'img/services/service-2-big.jpg',
                        'img/services/service-3-big.jpg',
                    ],
                ],
                [
                    'link'      => 'https://link-to-your-website.com',
                    'image'     => 'img/services/service-2.jpg',
                    'mediaType' => 'youtube',
                    'youtubeId' => 'SjJhuZQlkbA',
                ],
                [
                    'link'      => '',
                    'image'     => 'img/services/service-3.jpg',
                    'mediaType' => 'image',
                ],
                [
                    'link'      => 'https://link-to-your-website.com',
                    'image'     => 'img/services/service-4.jpg',
                    'mediaType' => 'video',
                    'videoUrl'  => 'img/video.mp4',
                ],
            ],
            'globalButtons' => [
                ['action' => 'clients', 'styleClass' => 'btn-secondary'],
            ],
            'finalButtons' => [
                ['action' => 'clients', 'styleClass' => ''],
                ['action' => 'contact', 'styleClass' => 'btn-secondary'],
            ],
        ],
        

        'clients' => [
            'items' => [
                ['name' => 'Logo Ipsum', 'logoUrl' => 'img/clients/logoipsum-391.png'],
                ['name' => 'Logo Ipsum', 'logoUrl' => 'img/clients/logoipsum-393.png'],
                ['name' => 'Logo Ipsum', 'logoUrl' => 'img/clients/logoipsum-406.png'],
                ['name' => 'Logo Ipsum', 'logoUrl' => 'img/clients/logoipsum-408.png'],
                ['name' => 'Logo Ipsum', 'logoUrl' => 'img/clients/logoipsum-410.png'],
                ['name' => 'Logo Ipsum', 'logoUrl' => 'img/clients/logoipsum-414.png'],
            ],
            'buttons' => [
                ['action' => 'contact', 'styleClass' => ''],
                ['action' => '',        'link' => 'link-to-cv.pdf', 'styleClass' => 'btn-secondary'],
            ],
        ],

        'contact' => [
            'directContact' => [
                ['icon' => 'fa-regular fa-envelope-open', 'value' => 'amr@medians.tech'],
                ['icon' => 'fa-brands fa-whatsapp',       'value' => '+2 011 5655 8448'],
            ],
            'socialLinks' => [
                ['icon' => 'fa-brands fa-linkedin-in', 'url' => 'https://linkedin.com',  'class' => 'linkedin'],
                ['icon' => 'fa-brands fa-github',      'url' => 'https://github.com',    'class' => 'github'],
                ['icon' => 'fa-brands fa-facebook',    'url' => 'https://facebook.com',  'class' => 'facebook'],
                ['icon' => 'fa-brands fa-twitter',     'url' => 'https://twitter.com',   'class' => 'twitter'],
                ['icon' => 'fa-brands fa-instagram',   'url' => 'https://instagram.com', 'class' => 'instagram'],
            ],
            'buttons' => [
                ['action' => 'open_contact_form', 'styleClass' => ''],
                ['action' => 'projects',          'styleClass' => 'btn-secondary'],
            ],
        ],

        'hobbies' => [
            'blocks' => [
                [],
                ['className' => 'list-with-icons'],
                [],
            ],
            'buttons' => [
                ['action' => 'contact', 'styleClass' => ''],
                ['action' => 'about',   'styleClass' => 'btn-secondary'],
            ],
        ],

        'age' => [
            'buttons' => [
                ['action' => 'about', 'styleClass' => ''],
                ['action' => '',      'link' => 'link-to-cv.pdf', 'styleClass' => 'btn-secondary'],
            ],
        ],

        'cv' => [
            'buttons' => [
                ['action' => '', 'link' => 'assets/link-to-cv.pdf', 'styleClass' => ''],
            ],
        ],

        'education' => [
            'buttons' => [
                ['action' => '',      'link' => 'link-to-cv.pdf', 'styleClass' => ''],
                ['action' => 'about', 'styleClass' => 'btn-secondary'],
            ],
        ],

        'experience' => [
            'buttons' => [
                ['action' => '',         'link' => 'link-to-cv.pdf', 'styleClass' => ''],
                ['action' => 'projects', 'styleClass' => 'btn-secondary'],
            ],
        ],

        'awards' => [
            'buttons' => [
                ['action' => '',         'link' => 'link-to-cv.pdf', 'styleClass' => ''],
                ['action' => 'projects', 'styleClass' => 'btn-secondary'],
            ],
        ],

        'msg_success' => [
            'buttons' => [
                ['action' => 'projects', 'styleClass' => ''],
                ['action' => 'hobbies',  'styleClass' => 'btn-secondary'],
            ],
        ],

        'hello'   => ['buttons' => []],
        'error'   => ['buttons' => []],
        'contact' => [],
    ];

    // ─────────────────────────────────────────────────────────────────────────

    public function run(): void
    {
        $i = 1;
        foreach ($this->translations as $sectionKey => $locales) {

            // 1. Upsert the parent section row (locale-agnostic).
            $section = ContentSection::firstOrCreate(
                ['section_key' => $sectionKey],
                ['sort_order' => $i],
            );

            // 2. For every locale, build the merged payload and upsert the translation.
            foreach ($locales as $locale => $translatedData) {

                $merged = $this->mergeWithShared($sectionKey, $locale, $translatedData);

                ContentSectionTranslation::updateOrCreate(
                    [
                        'content_section_id' => $section->id,
                        'locale'             => $locale,
                    ],
                    ['data' => $merged]
                );
            }
            $i++;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Deep-merge translated strings with their shared (non-translatable) counterparts.
     *
     * For indexed arrays of objects (buttons, stats, items …) we zip the two
     * arrays by position so each element gets the translated label merged with
     * the shared action/icon/path values.
     */
    private function mergeWithShared(string $sectionKey, string $locale, array $translated): array
    {
        $shared = $this->sharedData[$sectionKey] ?? [];
        $result = $translated;

        foreach ($shared as $field => $sharedValue) {

            if (!isset($result[$field])) {
                // Field exists only in shared (e.g. imageUrl, socialLinks).
                $result[$field] = $sharedValue;
                continue;
            }

            $translatedValue = $result[$field];

            if ($this->isIndexedArray($sharedValue) && $this->isIndexedArray($translatedValue)) {
                // Zip-merge positional arrays (buttons, stats, items …).
                $result[$field] = $this->zipMergeArrays($translatedValue, $sharedValue);
            } elseif (is_array($sharedValue) && is_array($translatedValue)) {
                // Associative merge (e.g. nested objects).
                $result[$field] = array_merge($sharedValue, $translatedValue);
            }
            // Scalars: translated value wins (already in $result).
        }

        // Section-specific post-processing.
        $result = $this->postProcess($sectionKey, $locale, $result, $shared);

        return $result;
    }

    /**
     * Merge two positional arrays element-by-element.
     * Translated keys overwrite shared keys; extra shared keys are appended.
     */
    private function zipMergeArrays(array $translated, array $shared): array
    {
        $count  = max(count($translated), count($shared));
        $merged = [];

        for ($i = 0; $i < $count; $i++) {
            $t = $translated[$i] ?? [];
            $s = $shared[$i]     ?? [];

            if (is_array($t) && is_array($s)) {
                $merged[] = array_merge($s, $t); // shared first, translated wins
            } else {
                $merged[] = $t ?? $s;
            }
        }

        return $merged;
    }

    /**
     * Handle sections whose structure needs more than a flat zip-merge.
     */
    private function postProcess(string $key, string $locale, array $data, array $shared): array
    {
        // ── skills: merge category names into the shared category objects ──
        if ($key === 'skills' && isset($data['categories'], $shared['categories'])) {
            foreach ($data['categories'] as $i => $cat) {
                $data['categories'][$i] = array_merge(
                    $shared['categories'][$i] ?? [],
                    $cat
                );
            }
        }

        // ── projects: merge item titles/summaries into shared item objects ──
        if ($key === 'projects' && isset($data['items'], $shared['items'])) {
            foreach ($data['items'] as $i => $item) {
                $data['items'][$i] = array_merge(
                    $shared['items'][$i] ?? [],
                    $item
                );
            }
        }

        // ── contact: merge directContact labels into shared icon/value rows ─
        if ($key === 'contact' && isset($data['directContact'], $shared['directContact'])) {
            foreach ($data['directContact'] as $i => $row) {
                $data['directContact'][$i] = array_merge(
                    $shared['directContact'][$i] ?? [],
                    $row
                );
            }
        }

        // ── hobbies: carry className from shared block stubs ─────────────────
        if ($key === 'hobbies' && isset($data['blocks'], $shared['blocks'])) {
            foreach ($data['blocks'] as $i => $block) {
                $sharedBlock = $shared['blocks'][$i] ?? [];
                if (!empty($sharedBlock)) {
                    $data['blocks'][$i] = array_merge($sharedBlock, $block);
                }
            }
        }

        return $data;
    }

    private function isIndexedArray(mixed $value): bool
    {
        return is_array($value) && array_is_list($value);
    }
}