/**
 * Unique, page-specific copy for every tuition landing page in TUITION_ROUTES.
 * Keeps the programmatic pages from reading as near-duplicates of each other.
 */
export interface TuitionContent {
    description: string;
    intro: string[];
    topics: { title: string; desc: string }[];
    faqs: { question: string; answer: string }[];
}

const t = (title: string, desc: string) => ({ title, desc });
const q = (question: string, answer: string) => ({ question, answer });

const classes: Record<string, TuitionContent> = {
    'class-1-5': {
        description: "1:1 online tuition for Classes 1–5: reading, number sense, EVS and language foundations with patient tutors, in English or Malayalam. Book a free demo.",
        intro: [
            "Classes 1 to 5 are where a child's relationship with learning is formed. Reading fluency, number sense and the habit of asking questions matter far more at this stage than speed or marks. Our primary tutors teach one child at a time, so a slow reader is never rushed and a quick learner is never held back.",
            "Sessions are short, visual and interactive, using a digital whiteboard, stories and simple problems. Tutors can teach in English, Malayalam or a mix of both, and parents receive a monthly progress report covering attendance, chapters completed and areas to strengthen.",
        ],
        topics: [
            t("Reading and phonics", "Letter sounds, blending and reading aloud, so reading in English and Malayalam becomes comfortable."),
            t("Number sense", "Place value, the four operations, tables and simple word problems built on understanding rather than memorising."),
            t("EVS and general science", "Plants, animals, water, food and the environment explained through everyday examples."),
            t("Writing and handwriting", "Neat handwriting, spelling, sentence building and short paragraph writing."),
            t("Study habits", "Homework routines, note revision and confidence for school tests."),
        ],
        faqs: [
            q("Is online tuition suitable for children in Classes 1 to 5?", "Yes, when sessions are one-to-one and short. A tutor can hold a young child's attention with a whiteboard, pictures and questions, and a parent can sit nearby for the first few classes. We recommend a quiet corner and a tablet or laptop with a stable connection."),
            q("Can the tutor teach in Malayalam?", "Yes. Tutors can teach in English, Malayalam or a bilingual mix, whichever helps your child understand best."),
            q("How long is each session for primary students?", "Session length and frequency are planned after the free demo, based on your child's age, attention span and goals. Younger children usually do better with shorter, more frequent classes."),
        ],
    },
    'class-1': {
        description: "Online tuition for Class 1: letters, phonics, numbers to 100 and a happy start to school. Gentle 1:1 tutors, English or Malayalam. Book a free demo.",
        intro: [
            "Class 1 is a child's first full year of formal schooling, and it can feel overwhelming. Our Class 1 tutors focus on making school feel safe and enjoyable while building the basics: recognising letters and their sounds, forming words, counting and understanding numbers up to 100.",
            "Every session is playful and paced to the child. We use pictures, rhymes, counting games and simple writing practice, and we keep parents informed about what was covered so reading and counting can continue naturally at home.",
        ],
        topics: [
            t("Letters and sounds", "Alphabet recognition, phonics and blending simple words such as cat, sun and pen."),
            t("Counting and numbers", "Numbers up to 100, before and after, more and less, and simple addition and subtraction."),
            t("Shapes, patterns and measures", "Basic shapes, patterns, long and short, heavy and light."),
            t("Pencil control", "Pre-writing strokes, letter formation and copying short words neatly."),
            t("Class routines", "Listening, following instructions and answering in full sentences."),
        ],
        faqs: [
            q("My child is just starting Class 1. Is one-to-one tuition too early?", "Not if it is light and encouraging. For many children a gentle 1:1 class removes the anxiety of a crowded classroom and builds early confidence in reading and counting."),
            q("What if my child does not know the alphabet yet?", "That is a common starting point. We begin with letter recognition and sounds, then move to simple words at your child's pace."),
            q("Do you follow the school's textbook?", "Yes. Tell us the board and school textbook during the demo and the tutor will align lessons with what is taught in class."),
        ],
    },
    'class-2': {
        description: "Class 2 online tuition with 1:1 tutors: fluent reading, spelling, addition and subtraction with carrying, and EVS basics. Free demo class available.",
        intro: [
            "In Class 2, children are expected to move from recognising words to reading short passages, and from counting to adding and subtracting with carrying and borrowing. Some children make this jump easily; others need a little more time and practice. One-to-one tuition gives them exactly that.",
            "Our Class 2 tutors strengthen reading fluency, spelling and sentence formation, and make arithmetic concrete with objects, number lines and drawings before moving to written sums.",
        ],
        topics: [
            t("Reading short passages", "Fluency, expression and understanding of simple stories and poems."),
            t("Addition and subtraction", "Two-digit sums with carrying and borrowing, and simple word problems."),
            t("Spelling and sentences", "Common spellings, naming words, action words and writing three to four sentences."),
            t("Time, money and measures", "Reading clocks, recognising coins and notes, and comparing lengths."),
            t("EVS", "Family, food, animals, plants, safety and the neighbourhood."),
        ],
        faqs: [
            q("My Class 2 child reads slowly. Can tuition help?", "Yes. Regular guided reading, phonics revision and vocabulary work usually improve fluency steadily. The tutor tracks progress and shares it in the monthly report."),
            q("Can you help with Malayalam or Hindi reading too?", "Yes. Malayalam and Hindi reading and writing foundations can be taught alongside English."),
            q("How do you keep a seven-year-old engaged online?", "We keep activities short and varied, with a whiteboard, drawing, questions and quick games, and we adjust the pace to the child."),
        ],
    },
    'class-3': {
        description: "Online tuition for Class 3: multiplication tables, reading comprehension, paragraph writing and EVS with patient 1:1 tutors. Book a free demo class.",
        intro: [
            "Class 3 introduces multiplication, longer reading passages and the first real written answers. It is also the year many children start to feel that they are either good or bad at a subject. Our tutors work to keep that belief from forming by making each new idea understandable.",
            "We teach multiplication as repeated addition before tables are memorised, practise comprehension with short passages, and guide children from single sentences to well-formed paragraphs.",
        ],
        topics: [
            t("Multiplication and tables", "Understanding multiplication, learning tables up to 10 and solving simple word problems."),
            t("Reading comprehension", "Answering who, what, why and how questions from short passages."),
            t("Paragraph writing", "Picture description, short stories and simple letters."),
            t("Fractions and measures", "Halves, quarters, length, weight and capacity in everyday contexts."),
            t("EVS and science", "Our body, plants, animals, shelter and water through observation and examples."),
        ],
        faqs: [
            q("My child finds tables hard to remember. What can you do?", "We teach patterns and meaning first, then use short daily practice and games. Memorisation is much easier once the child understands what a table represents."),
            q("Will the tutor follow my child's school syllabus?", "Yes. Lessons are aligned with the school's board and textbook, with extra practice on topics where your child needs support."),
            q("Can I see what was taught in each class?", "Yes. Parents get regular updates and a monthly progress report with attendance, topics covered and recommendations."),
        ],
    },
    'class-4': {
        description: "Class 4 online tuition: long division, fractions, comprehension, grammar and science concepts, taught 1:1 by caring tutors. Free demo class available.",
        intro: [
            "Class 4 is a bridge year. Division, fractions and longer written answers appear, and the textbooks become noticeably denser. Children who miss a concept here often carry the gap into middle school, so it is worth fixing early.",
            "Our Class 4 tutors revisit earlier basics where needed and then build up to the current chapters. We practise grammar in context, teach children how to read a question carefully and show how to structure a clear written answer.",
        ],
        topics: [
            t("Division and larger numbers", "Numbers up to five digits, long division and multi-step word problems."),
            t("Fractions", "Equivalent fractions, comparing fractions and adding like fractions with diagrams."),
            t("Grammar and vocabulary", "Tenses, nouns, adjectives, prepositions and building vocabulary through reading."),
            t("Comprehension and writing", "Understanding unseen passages, writing notices, messages and short essays."),
            t("Science and social studies", "Simple machines, food and health, maps and the people around us."),
        ],
        faqs: [
            q("Why does Class 4 feel harder than Class 3?", "The syllabus moves from direct recall to understanding and application. Children need to read longer text, handle multi-step problems and write complete answers."),
            q("Can you help my child prepare for school tests?", "Yes. We revise chapters, practise likely question types and teach simple strategies for managing time and checking answers."),
            q("Is a free demo available before I commit?", "Yes. You can book a free demo class to meet a tutor, see how a session works and discuss your child's needs."),
        ],
    },
    'class-5': {
        description: "Class 5 online tuition: fractions, decimals, grammar, comprehension and science, with a smooth bridge to Class 6. 1:1 expert tutors. Book a free demo.",
        intro: [
            "Class 5 is the last primary year, and the move to Class 6 is a big one: more subjects, more teachers and less hand-holding. The best preparation is a solid grasp of fractions, decimals, reading comprehension and clear writing.",
            "Our Class 5 tutors teach the current syllabus while quietly closing earlier gaps. We also introduce habits that middle school rewards: making notes, revising regularly and attempting questions independently before asking for help.",
        ],
        topics: [
            t("Fractions and decimals", "Operations on fractions, decimal place value and simple conversions."),
            t("Geometry and data", "Angles, perimeter, area, bar graphs and reading simple tables."),
            t("English language", "Grammar, comprehension, letter and paragraph writing and vocabulary."),
            t("Science", "Living things, the human body, force, light and the solar system explained with examples."),
            t("Middle-school readiness", "Note-making, revision plans and answer presentation."),
        ],
        faqs: [
            q("How can tuition help my child get ready for Class 6?", "We strengthen the topics that Class 6 builds on, mainly fractions, decimals, reading and writing, and we teach study habits that make the move to subject-wise teaching easier."),
            q("My child is good at maths but weak in English. Can lessons focus on one subject?", "Yes. Plans are individual, so we can concentrate on the subject or subjects where your child needs the most support."),
            q("Do you cover Malayalam and Hindi?", "Yes. Malayalam and Hindi are available alongside English, maths and science."),
        ],
    },
    'class-6': {
        description: "Online tuition for Class 6: integers, fractions, ratio, basic algebra, science and social science with 1:1 expert tutors. Book your free demo class.",
        intro: [
            "Class 6 is when school becomes subject-wise. Maths introduces integers, ratio and the first ideas of algebra, science separates into distinct topics and social science brings history, geography and civics. Many students find this transition harder than expected.",
            "Our Class 6 tutors help children adjust: they explain new concepts patiently, teach how to study each subject differently and build the confidence to ask questions. We follow your child's board and textbook, whether CBSE, ICSE or State.",
        ],
        topics: [
            t("Maths", "Whole numbers, integers, fractions, decimals, ratio and an introduction to algebra and geometry."),
            t("Science", "Food, materials, living organisms, motion and measurement through diagrams and everyday examples."),
            t("Social science", "Early history, physical geography and civics, with map work and short-answer practice."),
            t("English and languages", "Grammar, reading, writing and literature, plus Malayalam and Hindi support."),
            t("Study skills", "Timetables, note-making and revision for unit tests and term exams."),
        ],
        faqs: [
            q("Why do students struggle in Class 6?", "The syllabus widens and teaching becomes subject-based, so students must manage more content and more abstract ideas at once. One-to-one support helps them settle in."),
            q("Do you teach all subjects for Class 6?", "We teach maths, science, social science, English, Malayalam and Hindi. You can choose one subject or several."),
            q("Which boards do you support at this level?", "CBSE, ICSE and Kerala State syllabi, and IGCSE-style foundation where relevant."),
        ],
    },
    'class-7': {
        description: "Class 7 online tuition: algebra, geometry, science and social science with 1:1 expert tutors, aligned to CBSE, ICSE and State. Free demo available.",
        intro: [
            "Class 7 is where maths and science begin to demand real understanding. Simple equations, triangles, rational numbers, heat, acids and bases and the structure of plants and animals all appear, and shortcuts that worked earlier no longer do.",
            "Our tutors diagnose weak spots early, explain each concept with diagrams and worked examples and give targeted practice. We also help students write better answers, which makes a large difference in school exams.",
        ],
        topics: [
            t("Maths", "Integers, fractions and decimals, simple equations, lines and angles, triangles and perimeter and area."),
            t("Science", "Nutrition, heat, acids and bases, weather, motion and time, and life processes."),
            t("Social science", "Medieval history, environment, democracy and equality, with map and timeline practice."),
            t("English", "Grammar, comprehension, formal and informal writing and literature."),
            t("Exam technique", "Answer structure, presentation and time management."),
        ],
        faqs: [
            q("Is Class 7 important for board exams?", "Class 7 has no board exam, but it builds the algebra, geometry and science concepts that Classes 9 and 10 depend on. Strong understanding now makes board years easier."),
            q("Can you help if my child dislikes maths?", "Yes. Dislike often comes from one or two missed concepts. We find those, rebuild them step by step and make practice manageable."),
            q("How often should my child have classes?", "That depends on the goals and subjects. We recommend a schedule after the free demo and adjust it as progress is reviewed."),
        ],
    },
    'class-8': {
        description: "Online tuition for Class 8: algebra, mensuration, force and pressure, chemistry basics and more with 1:1 expert tutors. Book a free demo class today.",
        intro: [
            "Class 8 is the foundation year for the board classes. Algebraic expressions, linear equations, mensuration, force and pressure, and the basics of chemistry all show up here, and the same ideas return in Classes 9 and 10 at a higher level.",
            "Our Class 8 tutors treat this as the year to build lasting understanding. We link each chapter to what follows in Class 9, teach students to solve problems independently and help them present clear, complete answers.",
        ],
        topics: [
            t("Maths", "Algebraic expressions, linear equations, factorisation, mensuration, data handling and squares and cubes."),
            t("Physics and chemistry", "Force and pressure, friction, sound, light, materials and chemical effects of electric current."),
            t("Biology", "Crop production, microorganisms, cell structure and reproduction in animals."),
            t("Social science", "Modern history, resources, the Constitution and the judiciary."),
            t("Foundation for Class 9", "Concept links, problem-solving practice and early exposure to board-style questions."),
        ],
        faqs: [
            q("Should we start board preparation in Class 8?", "Not formal board preparation, but strengthening Class 8 concepts is the most effective start. It makes Class 9 much smoother."),
            q("Do you teach science as separate physics, chemistry and biology topics?", "Yes. We cover each strand of the science syllabus and show how they connect."),
            q("Can my child join mid-year?", "Yes. Students can join at any time. The tutor starts with a quick assessment and focuses on the current chapters and any gaps."),
        ],
    },
    'class-9': {
        description: "Class 9 online tuition: polynomials, coordinate geometry, motion, atoms and more. 1:1 expert tutors for CBSE, ICSE and State. Book a free demo class.",
        intro: [
            "Class 9 is the first year of secondary school, and it is a noticeable step up. Polynomials, coordinate geometry, motion and force, atoms and molecules, and cell biology are conceptual and need regular practice rather than last-minute revision.",
            "Our Class 9 tutors teach for understanding and for exams. We solve a wide range of problems, practise derivations and diagrams and introduce board-style question patterns, so the Class 10 year starts from a position of strength.",
        ],
        topics: [
            t("Maths", "Number systems, polynomials, coordinate geometry, Euclid's geometry, triangles, areas and statistics."),
            t("Physics", "Motion, force and laws of motion, gravitation, work and energy and sound."),
            t("Chemistry", "Matter, atoms and molecules, structure of the atom and mixtures."),
            t("Biology", "The cell, tissues, diversity in living organisms and health."),
            t("Social science and English", "History, geography, political science, economics, grammar and literature."),
        ],
        faqs: [
            q("Why is Class 9 so important if the board exam is in Class 10?", "Most Class 10 chapters build directly on Class 9 concepts. Gaps in Class 9 usually show up as stress and low marks in the board year."),
            q("Do you teach numericals and derivations step by step?", "Yes. We work through them live on the whiteboard, then give similar problems for independent practice."),
            q("Can you help with both school exams and concept clarity?", "Yes. We cover the school syllabus and exam patterns while keeping the focus on genuine understanding."),
        ],
    },
    'class-10': {
        description: "Class 10 online tuition for SSLC, CBSE and ICSE boards: revision, previous papers, doubts and exam strategy with 1:1 expert tutors. Free demo class.",
        intro: [
            "Class 10 is a board year, whether the exam is the Kerala SSLC, the CBSE Class 10 board or the ICSE. Students face a large syllabus, strict marking and a lot of pressure from school and home. A structured plan and regular doubt clearing make the year far more manageable.",
            "Our Class 10 tutors build a month-by-month plan, complete the syllabus early, then move to revision and timed practice with previous question papers. We pay close attention to presentation, steps and time management, because these cost students marks as often as gaps in knowledge.",
        ],
        topics: [
            t("Maths", "Real numbers, polynomials, quadratic equations, arithmetic progressions, trigonometry, coordinate geometry and statistics."),
            t("Physics", "Electricity, magnetic effects, light, refraction and the human eye."),
            t("Chemistry", "Chemical reactions, acids, bases and salts, metals and non-metals and carbon compounds."),
            t("Biology and social science", "Life processes, heredity, control and coordination, history, geography and economics."),
            t("Board exam strategy", "Previous papers, marking-scheme practice, revision timetables and exam-day habits."),
        ],
        faqs: [
            q("When should Class 10 revision start?", "Ideally the syllabus is finished well before the preparatory exams, leaving several weeks for revision and timed papers. If you are starting late, the tutor will make a compressed plan around your exam date."),
            q("Do you support SSLC, CBSE and ICSE students?", "Yes. Lessons follow your board's syllabus, textbooks and question patterns."),
            q("Can my child practise previous question papers with a tutor?", "Yes. Previous papers and model papers are a core part of our Class 10 plan, along with feedback on each answer."),
        ],
    },
    'class-11': {
        description: "Class 11 and Plus One online tuition in physics, chemistry, biology and maths with 1:1 expert tutors. Strong foundations for boards and entrances.",
        intro: [
            "Class 11, called Plus One in Kerala, is a sharp jump in difficulty. Physics, chemistry, biology and maths are taught at a depth that surprises many students, and the same concepts are later tested in the Class 12 boards and in entrance exams such as NEET, JEE and KEAM.",
            "Our tutors help students build real understanding of the concepts, practise numericals and derivations regularly and keep up with the school pace. We also guide students on how to balance school tests with long-term entrance preparation.",
        ],
        topics: [
            t("Physics", "Units, kinematics, laws of motion, work and energy, gravitation, thermodynamics and waves."),
            t("Chemistry", "Mole concept, atomic structure, periodic table, bonding, equilibrium and basic organic chemistry."),
            t("Biology", "Diversity of life, cell biology, plant and human physiology and biomolecules."),
            t("Maths", "Sets, functions, trigonometry, sequences, limits, straight lines and conic sections."),
            t("Entrance foundation", "Concept-first practice that supports NEET, JEE and KEAM preparation later."),
        ],
        faqs: [
            q("Why do many students struggle in Class 11?", "The syllabus is deeper and more abstract, school pace is quick and there is less spoon-feeding. Regular 1:1 support helps students keep pace instead of falling behind."),
            q("Do you teach Plus One for the Kerala State syllabus?", "Yes. We teach Higher Secondary (Plus One) for the Kerala State syllabus, as well as CBSE and ISC Class 11."),
            q("Can you help me prepare for NEET or JEE along with school?", "Our tutors can build concept clarity and problem-solving practice that supports entrance preparation alongside school lessons. Please discuss your target during the free demo."),
        ],
    },
    'class-12': {
        description: "Class 12 and Plus Two online tuition for physics, chemistry, biology and maths: board prep, previous papers and entrance support. Free 1:1 demo class.",
        intro: [
            "Class 12, or Plus Two, is the most consequential school year. Board marks affect admissions, and entrance exams such as NEET, JEE, KEAM and CUET run in parallel. Students need a plan that covers both without burning out.",
            "Our Class 12 tutors complete the syllabus on schedule, then move to revision, previous papers and timed practice. We clear doubts quickly, because a doubt left for a week usually becomes several, and we adapt the plan to your board exam and entrance dates.",
        ],
        topics: [
            t("Physics", "Electrostatics, current electricity, magnetism, optics, modern physics and semiconductors."),
            t("Chemistry", "Solutions, electrochemistry, kinetics, coordination compounds and organic reactions."),
            t("Biology", "Reproduction, genetics, evolution, biotechnology and ecology."),
            t("Maths", "Calculus, vectors, three-dimensional geometry, matrices, determinants and probability."),
            t("Board and entrance practice", "Previous question papers, sample papers, time-bound tests and error analysis."),
        ],
        faqs: [
            q("Can I get help for both board exams and entrance exams?", "Yes. We build a plan that completes and revises the board syllabus while setting aside time for entrance-style problems."),
            q("Do you teach Plus Two as per the Kerala State syllabus?", "Yes. We cover Plus Two for the Kerala State syllabus, and also CBSE and ISC Class 12."),
            q("What if my child needs help with one chapter only?", "That is fine. You can book a focused plan for specific chapters or topics, and extend it later if needed."),
        ],
    },
};

const subjects: Record<string, TuitionContent> = {
    english: {
        description: "1:1 online English tuition for KG–12: grammar, reading, writing, spoken English and board literature texts with expert tutors. Book a free demo class.",
        intro: [
            "English is the language of instruction in most schools, so a weakness in English quietly affects every other subject. Students who struggle to read quickly or write clearly lose marks in science and social science as well. One-to-one English tuition fixes this at the root.",
            "Our English tutors work on reading fluency, vocabulary, grammar, writing and spoken confidence, and they also teach the literature texts your school or board prescribes. Lessons begin with a short assessment so the plan targets real gaps, not a generic syllabus.",
        ],
        topics: [
            t("Reading and comprehension", "Fluency, inference and answering questions from unseen passages."),
            t("Grammar and vocabulary", "Tenses, clauses, punctuation, word usage and building a stronger vocabulary."),
            t("Writing skills", "Essays, letters, notices, reports, articles and creative writing, with detailed feedback."),
            t("Spoken English", "Pronunciation, confidence and everyday conversation practice."),
            t("Board literature", "Prose, poetry and drama for CBSE, ICSE, Kerala State and IGCSE."),
        ],
        faqs: [
            q("Can you teach spoken English as well as school English?", "Yes. Spoken English and confidence-building can be part of the plan alongside the school syllabus."),
            q("Which classes do you cover for English?", "From KG to Class 12, including CBSE, ICSE, ISC, Kerala State and IGCSE English."),
            q("My child understands English but writes poorly. Can you help?", "Yes. We practise structuring paragraphs and essays, and give written feedback on each piece so improvement is visible."),
        ],
    },
    maths: {
        description: "1:1 online maths tuition for KG–12: concepts, problem solving and exam practice with patient expert tutors. CBSE, ICSE, State, IGCSE. Free demo class.",
        intro: [
            "Maths is cumulative. A missed idea in Class 5 shows up as confusion in Class 8 and panic in Class 10. Group classes move on whether or not you have understood; one-to-one tutoring does not. Our tutors find where understanding broke down and rebuild from there.",
            "We teach concepts with visuals and worked examples, then move to graded practice so students can solve problems independently. For board classes, we add previous papers, speed and accuracy training and presentation of steps for full marks.",
        ],
        topics: [
            t("Foundation arithmetic", "Number sense, fractions, decimals, percentages and ratio."),
            t("Algebra and geometry", "Equations, polynomials, quadratic equations, theorems and constructions."),
            t("Trigonometry and mensuration", "Ratios, identities, heights and distances, areas and volumes."),
            t("Higher secondary maths", "Functions, calculus, vectors, matrices and probability."),
            t("Exam preparation", "Timed practice, previous papers and error analysis."),
        ],
        faqs: [
            q("My child is afraid of maths. Will tuition really help?", "Fear usually comes from specific gaps and past failures. With small, achievable steps and a patient tutor, most students rebuild confidence and start attempting problems on their own."),
            q("Do you teach maths for all boards?", "Yes. We teach maths for CBSE, ICSE, ISC, Kerala State and IGCSE."),
            q("Can you help with competitive exam maths?", "We can build the strong conceptual base that entrance exams need. Please share your target exam during the free demo."),
        ],
    },
    science: {
        description: "1:1 online science tuition for Classes 1–10: physics, chemistry and biology explained with diagrams and examples. CBSE, ICSE, State. Book a free demo.",
        intro: [
            "Science rewards curiosity, but school pressure often turns it into memorisation. Our science tutors do the opposite: they explain why things happen, use diagrams and everyday examples, and then show how to turn that understanding into clear exam answers.",
            "From primary EVS to Class 10 physics, chemistry and biology, we follow your board's textbook and highlight the diagrams, definitions and numerical problems that carry marks.",
        ],
        topics: [
            t("Primary EVS", "Plants, animals, food, water, air and the environment through observation."),
            t("Physics basics", "Motion, force, light, sound, electricity and energy."),
            t("Chemistry basics", "Matter, acids and bases, metals and non-metals, chemical reactions and carbon compounds."),
            t("Biology basics", "Cells, human body systems, life processes, heredity and ecology."),
            t("Answer writing", "Diagrams, definitions, reasoning questions and numericals presented for full marks."),
        ],
        faqs: [
            q("Do you teach physics, chemistry and biology separately?", "Yes. We teach each strand of the science syllabus and show how they connect, so students can focus on whichever branch they find hardest."),
            q("Can you help with diagrams and numericals?", "Yes. We draw diagrams live on the whiteboard and work through numericals step by step."),
            q("Which classes does the science tuition cover?", "Science and EVS from primary classes up to Class 10. For Class 11 and 12 we teach physics, chemistry and biology as separate subjects."),
        ],
    },
    'social-science': {
        description: "1:1 online social science tuition: history, geography, civics and economics with maps, timelines and answer-writing practice. Book a free demo class.",
        intro: [
            "Social science is often seen as a subject to memorise, yet students who understand cause and effect remember far more and write better answers. Our tutors teach history, geography, civics and economics as connected stories, not as lists of dates.",
            "We use timelines, maps and short revision notes, and we practise the question formats your board uses, from one-mark answers to long essays and map work.",
        ],
        topics: [
            t("History", "Timelines, causes and consequences, and key personalities and events."),
            t("Geography", "Physical features, climate, resources, agriculture and map-pointing."),
            t("Civics and political science", "The Constitution, government, rights and democracy."),
            t("Economics", "Development, sectors of the economy, money, credit and consumer rights."),
            t("Answer writing", "Structuring short and long answers and revising with concise notes."),
        ],
        faqs: [
            q("How can my child stop just memorising social science?", "We teach the reasons behind events and link topics together with timelines and maps, which makes recall much easier."),
            q("Do you help with map work?", "Yes. Map-pointing and labelling practice is part of the geography and history lessons."),
            q("Which classes do you cover?", "Social science for Classes 5 to 10 across CBSE, ICSE and Kerala State."),
        ],
    },
    malayalam: {
        description: "1:1 online Malayalam tuition: reading and writing foundation courses for children, plus school syllabus support, for Kerala and Gulf students. Free demo.",
        intro: [
            "Many children, especially those growing up outside Kerala, speak Malayalam at home but cannot read or write it. Others need help with Malayalam as a school subject, including grammar, prose, poetry and composition. Our Malayalam tutors support both.",
            "Foundation courses teach the script step by step: vowels, consonants, conjuncts, simple words and then sentences, with a lot of speaking and reading practice. Students who are following the school syllabus get chapter-wise help, grammar and answer writing.",
        ],
        topics: [
            t("Script foundation", "Letters, vowel signs, conjuncts and writing practice for beginners."),
            t("Reading fluency", "Reading words, sentences and short stories aloud with correct pronunciation."),
            t("Grammar", "Vyakaranam, sandhi, samasam and word forms as required by the school syllabus."),
            t("Prose and poetry", "Understanding, appreciation and answer writing for prescribed texts."),
            t("Composition", "Letters, essays, speeches and creative writing."),
        ],
        faqs: [
            q("My child speaks Malayalam but cannot read it. Can you help?", "Yes. Our foundation approach teaches the script gradually and builds reading and writing alongside speaking. Progress depends on practice, but many children become confident readers with regular classes."),
            q("Can you teach Malayalam to children living in the Gulf?", "Yes. Classes are online, with timings that suit the Gulf as well as Kerala."),
            q("Do you teach Malayalam for the State syllabus?", "Yes. We support Malayalam as a first or second language for school syllabi, including Kerala State."),
        ],
    },
    hindi: {
        description: "1:1 online Hindi tuition for school students: script, grammar, reading, writing and board syllabus support with patient expert tutors. Free demo class.",
        intro: [
            "For many students outside the Hindi belt, Hindi is a second or third language, and it can feel unfamiliar. Our Hindi tutors start where the student is, whether that is learning the Devanagari script or preparing for a board exam.",
            "We cover reading, vyakaran (grammar), writing and the prescribed literature, and we practise the question formats that appear in school and board papers.",
        ],
        topics: [
            t("Devanagari script", "Varnamala, matras and reading and writing simple words."),
            t("Grammar (vyakaran)", "Sangya, sarvanam, kriya, visheshan, ling, vachan, kaal and sandhi."),
            t("Reading and literature", "Prose, poetry and comprehension from the prescribed textbooks."),
            t("Writing skills", "Letters, essays, notices and applications."),
            t("Exam preparation", "Previous papers, model answers and revision notes."),
        ],
        faqs: [
            q("Can you teach Hindi to a complete beginner?", "Yes. We begin with the script and sounds and move up gradually to words, sentences and the school syllabus."),
            q("Do you support Hindi for CBSE and State boards?", "Yes. We follow the syllabus and question patterns of your board."),
            q("Can my child learn both Hindi and Malayalam with you?", "Yes. Multiple subjects can be booked with separate tutors."),
        ],
    },
    physics: {
        description: "1:1 online physics tuition for Classes 9–12: concepts, numericals, derivations and exam practice with expert tutors. CBSE, ICSE, State. Free demo class.",
        intro: [
            "Physics is a subject where understanding and problem solving matter more than memory. Students who only memorise formulas struggle when a question is asked in an unfamiliar way. Our physics tutors teach the idea first, then the formula, then a wide range of problems.",
            "Lessons use a digital whiteboard for diagrams, free-body drawings, circuits and ray paths, and every topic ends with numerical practice at increasing difficulty.",
        ],
        topics: [
            t("Mechanics", "Motion, laws of motion, work, energy, momentum, gravitation and rotational motion."),
            t("Electricity and magnetism", "Electrostatics, current electricity, magnetic effects and electromagnetic induction."),
            t("Optics and waves", "Reflection, refraction, lenses, wave optics and sound."),
            t("Heat and modern physics", "Thermodynamics, kinetic theory, atoms, nuclei and semiconductors."),
            t("Numericals and derivations", "Stepwise solving, unit analysis and exam-style derivations."),
        ],
        faqs: [
            q("Which classes do you teach physics for?", "Class 9 and 10 science (physics portion) and Class 11 and 12 physics for CBSE, ICSE, ISC and Kerala State."),
            q("Can you help with numericals?", "Yes. Numerical problem-solving is central to our physics lessons, with graded practice from basic to challenging."),
            q("Will you help me prepare for NEET or JEE physics?", "We can build the conceptual and problem-solving base these exams require. Share your target in the free demo."),
        ],
    },
    chemistry: {
        description: "1:1 online chemistry tuition for Classes 9–12: physical, organic and inorganic chemistry, equations and numericals with expert tutors. Free demo class.",
        intro: [
            "Chemistry mixes concepts, calculations and a good deal of recall, which makes it hard to study without a plan. Our chemistry tutors break it into manageable parts and connect them so that reactions and trends begin to make sense instead of feeling like a list to memorise.",
            "We cover physical, inorganic and organic chemistry with clear reasoning, practise balancing equations and numericals regularly and use short revision sheets for facts and reactions.",
        ],
        topics: [
            t("Physical chemistry", "Mole concept, solutions, thermodynamics, equilibrium, kinetics and electrochemistry."),
            t("Inorganic chemistry", "Periodic trends, chemical bonding, the s-, p-, d- and f-block elements and coordination compounds."),
            t("Organic chemistry", "Nomenclature, isomerism, reaction mechanisms and named reactions."),
            t("School chemistry", "Chemical reactions, acids, bases and salts, metals, non-metals and carbon compounds for Classes 9 and 10."),
            t("Exam practice", "Equation balancing, numericals, reaction maps and previous papers."),
        ],
        faqs: [
            q("I find organic chemistry confusing. Can you help?", "Yes. We teach the underlying logic of mechanisms and then practise reactions in a structured way, so there is less to memorise."),
            q("Do you teach Classes 9 and 10 as well as 11 and 12?", "Yes. We teach the chemistry portion of Class 9 and 10 science and full chemistry for Classes 11 and 12."),
            q("Can you help with chemistry for entrance exams?", "We can build strong fundamentals for NEET and JEE chemistry. Share your goal in the free demo."),
        ],
    },
    biology: {
        description: "1:1 online biology tuition for school and Classes 11–12: diagrams, NCERT-based concepts and exam practice with expert tutors. Book a free demo class.",
        intro: [
            "Biology has a lot of terminology, processes and diagrams, and students often feel overwhelmed by the volume. Our biology tutors teach it as a connected story of how living systems work, with diagrams drawn live and reviewed until the student can reproduce them.",
            "For school and board classes we focus on textbook content and question patterns. For Class 11 and 12 and NEET aspirants, we add careful NCERT-based reading, and practice with objective questions.",
        ],
        topics: [
            t("Cell and molecular biology", "Cell structure, biomolecules, cell division and the basics of molecular biology."),
            t("Plant and human physiology", "Photosynthesis, respiration, digestion, circulation, excretion and the nervous system."),
            t("Genetics and evolution", "Inheritance, DNA, gene expression and evolution."),
            t("Ecology and environment", "Ecosystems, biodiversity and environmental issues."),
            t("Diagrams and practice", "Labelled diagrams, short and long answers and objective question practice."),
        ],
        faqs: [
            q("How do I remember so many biology terms?", "We teach terms in context with diagrams and processes, and use short revision cycles. Understanding the sequence of events makes recall much easier."),
            q("Do you teach biology for NEET?", "We build strong NCERT-based fundamentals and objective-question practice that supports NEET preparation. Please discuss your goal in the free demo."),
            q("Which classes do you cover for biology?", "The biology portion of science for Classes 6 to 10, and full biology for Class 11 and 12."),
        ],
    },
};

const boards: Record<string, TuitionContent> = {
    cbse: {
        description: "1:1 online CBSE tuition for Classes 1–12: NCERT-aligned lessons, board exam practice and doubt clearing with expert tutors. Book a free demo class.",
        intro: [
            "The CBSE curriculum is built around NCERT textbooks, competency-based questions and a strong emphasis on understanding. Class 10 and Class 12 board exams are national, so students need accurate content, clear answers and practice with the CBSE paper pattern.",
            "Our CBSE tutors teach strictly from NCERT, practise sample papers and previous year papers and teach students how to present answers in a way that fits the marking scheme. Internal assessments, projects and practicals are also supported.",
        ],
        topics: [
            t("NCERT-aligned teaching", "Chapter-wise lessons that follow NCERT content and exercises closely."),
            t("Competency-based questions", "Case-based, assertion-reason and application questions that are now common in CBSE papers."),
            t("Class 10 and 12 boards", "Sample papers, previous year papers and timed practice."),
            t("Internal assessment", "Help with projects, practicals, lab records and periodic tests."),
            t("Subjects covered", "Maths, science, social science, English, Hindi and Malayalam, and physics, chemistry and biology for senior classes."),
        ],
        faqs: [
            q("Do you teach strictly from NCERT?", "Yes. Our CBSE lessons follow the NCERT textbooks and the latest syllabus released by the board."),
            q("Can you help with CBSE board paper practice?", "Yes. We use sample papers and previous year papers and give feedback on answer presentation."),
            q("Which CBSE classes do you cover?", "From primary classes through Class 12."),
        ],
    },
    icse: {
        description: "1:1 online ICSE and ISC tuition: detailed syllabus coverage, English literature and board paper practice with expert tutors. Free demo class available.",
        intro: [
            "The ICSE and ISC curriculum, set by the CISCE, is known for its depth, particularly in English language and literature, and for detailed, application-based questions. Students need strong writing and a good command of the textbooks.",
            "Our ICSE tutors teach the full syllabus in detail, practise essays, letters and literature answers with feedback and prepare students for the ICSE (Class 10) and ISC (Class 12) exams with past papers and timed tests.",
        ],
        topics: [
            t("Detailed syllabus coverage", "In-depth lessons for each subject in line with the CISCE syllabus."),
            t("English language and literature", "Composition, grammar, prescribed prose, poetry and drama."),
            t("ICSE and ISC papers", "Specimen and previous papers with time-bound practice."),
            t("Science and maths", "Application-based problem solving and well-presented working."),
            t("Internal work", "Project and practical file support."),
        ],
        faqs: [
            q("Is the ICSE syllabus harder than other boards?", "It is generally broader and more detailed, especially in English, so students benefit from steady, structured study."),
            q("Do you support ISC for Class 11 and 12?", "Yes. We teach ISC subjects such as physics, chemistry, biology and maths."),
            q("Can you help with ICSE English literature?", "Yes. We teach the prescribed texts and how to write structured, evidence-based answers."),
        ],
    },
    state: {
        description: "1:1 online Kerala State Board tuition: SCERT syllabus, SSLC and Plus One/Plus Two support in English or Malayalam with expert tutors. Free demo class.",
        intro: [
            "The Kerala State Board syllabus, prepared by the SCERT, is followed by a large number of schools in Kerala. Students face term exams through the year and the public SSLC and Higher Secondary (Plus Two) examinations at the end of Classes 10 and 12.",
            "Our tutors teach from the State textbooks and can teach in Malayalam, English or both. They help students prepare for school term exams and public exams, with model papers and chapter-wise revision, and they support Plus One and Plus Two with the same care.",
        ],
        topics: [
            t("SCERT textbook alignment", "Lessons that follow the State textbooks chapter by chapter."),
            t("Term exam preparation", "First, second and annual exam revision plans."),
            t("SSLC", "Revision, model papers and focused practice for Class 10 public exams."),
            t("Plus One and Plus Two", "Higher Secondary physics, chemistry, biology and maths."),
            t("Bilingual teaching", "Explanations in Malayalam, English or a mix, as the student prefers."),
        ],
        faqs: [
            q("Can the tutor teach in Malayalam medium?", "Yes. Lessons can be in Malayalam, English or both."),
            q("Do you cover Plus One and Plus Two for the Kerala syllabus?", "Yes. We cover Higher Secondary science subjects and maths."),
            q("Do you help with SSLC revision?", "Yes. We work through the textbooks, previous papers and model papers with a revision schedule."),
        ],
    },
    igcse: {
        description: "1:1 online IGCSE tuition for Grades 9–10: Cambridge and Edexcel syllabus coverage, past paper practice and exam technique with expert tutors. Free demo.",
        intro: [
            "IGCSE is an international qualification taken at the end of Grades 9 and 10 (Year 10 and 11). It rewards application and clear reasoning more than rote recall, and it relies heavily on past paper practice and understanding the command words used in questions.",
            "Our IGCSE tutors cover the syllabus topic by topic, then train students on past papers, mark schemes and examiner expectations. Students learn how to read a question, structure a response and earn marks for method as well as the final answer.",
        ],
        topics: [
            t("Syllabus-based lessons", "Topic coverage aligned with your exam board's specification."),
            t("Past paper practice", "Timed papers with mark scheme review and feedback."),
            t("Command words", "Understanding what describe, explain, evaluate and calculate expect in an answer."),
            t("Core subjects", "Maths, physics, chemistry, biology and English."),
            t("Exam technique", "Time management, working shown and accuracy."),
        ],
        faqs: [
            q("Do you teach both Cambridge and Edexcel IGCSE?", "Please tell us your exam board during the free demo so the tutor can follow the correct specification and past papers."),
            q("Can you help with past papers?", "Yes. Past paper practice with mark scheme analysis is a core part of our IGCSE plans."),
            q("Which IGCSE subjects are available?", "Maths, physics, chemistry, biology and English are available. Ask us about other subjects."),
        ],
    },
};

/** Time-zone and city context used by the location pages. */
const locations: Record<string, TuitionContent> = {
    kerala: {
        description: "1:1 online tuition for students across Kerala: Calicut-based tutors for State, CBSE and ICSE syllabi, in English or Malayalam. Book a free demo class.",
        intro: [
            "BrightPath Eduvora is based in Calicut, and a large share of our students live across Kerala, from Kasaragod to Thiruvananthapuram. Online one-to-one classes mean no travel through traffic or monsoon rain, and no waiting for a batch to start.",
            "Our tutors know the Kerala syllabi well, including the State Board textbooks, the term-exam calendar, SSLC and Plus Two. They also teach CBSE and ICSE students, and can explain in Malayalam, English or both.",
        ],
        topics: [
            t("State, CBSE and ICSE", "Support for the syllabus your school follows, from primary classes to Plus Two."),
            t("Term exam preparation", "Revision plans for first term, second term and annual exams."),
            t("SSLC and Plus Two", "Model papers, previous papers and focused revision for public exams."),
            t("Malayalam and English medium", "Explanations in the language your child learns best."),
            t("Evening and weekend slots", "Classes after school hours, between 5:00 AM and 11:00 PM IST."),
        ],
        faqs: [
            q("Do you offer online tuition in all districts of Kerala?", "Yes. Classes are online, so students in any district can join with a laptop, tablet or phone and a stable internet connection."),
            q("Are classes available in Malayalam?", "Yes. Tutors can teach in Malayalam, English or a bilingual mix."),
            q("Where is BrightPath located?", "Our office is on Mavoor Road, Calicut, Kerala, and our tutors teach students online across Kerala and abroad."),
        ],
    },
    dubai: {
        description: "1:1 online tuition for students in Dubai: CBSE, ICSE and Kerala syllabus tutors with evening slots for UAE time. Book a free demo class today.",
        intro: [
            "Many Indian families in Dubai look for a tutor who understands the CBSE, ICSE or Kerala syllabus their child follows at school. BrightPath tutors teach those syllabi online, one-to-one, with schedules designed around the UAE school day.",
            "Dubai is 1.5 hours behind India, so an evening class at 6:00 PM in Dubai is 7:30 PM IST. We schedule around school hours, activities and weekends, and parents get a monthly progress report they can review together.",
        ],
        topics: [
            t("Indian-curriculum support", "CBSE, ICSE and Kerala syllabus tutoring from primary classes to Class 12."),
            t("UAE-friendly timings", "After-school and weekend slots, scheduled in UAE time."),
            t("Malayalam for Gulf children", "Reading and writing foundation courses for children who speak but cannot read Malayalam."),
            t("Exam preparation", "Board preparation for Classes 10 and 12 and term-exam revision."),
            t("Homework and doubts", "Regular doubt clearing so school work does not pile up."),
        ],
        faqs: [
            q("What class timings are available for students in Dubai?", "Classes can be scheduled between 5:00 AM and 11:00 PM IST, which is roughly 3:30 AM to 9:30 PM UAE time. Most Dubai students choose after-school or weekend slots."),
            q("Do you teach the CBSE and Kerala syllabus to students in Dubai?", "Yes. We teach CBSE, ICSE and Kerala State syllabi online."),
            q("How do payments and progress reports work?", "Parents receive monthly progress reports, and we will explain fees and payment options during the free demo."),
        ],
    },
    uae: {
        description: "1:1 online tuition across the UAE: Abu Dhabi, Sharjah, Dubai and Ajman students get CBSE, ICSE and Kerala syllabus tutors. Free demo class available.",
        intro: [
            "Families across the UAE, from Abu Dhabi and Sharjah to Ajman and Ras Al Khaimah, use BrightPath for personal one-to-one tuition in the Indian curriculum. Online classes remove commutes and let students learn at home after school.",
            "The UAE is 1.5 hours behind IST. We plan sessions around your child's school timetable, weekend and holiday schedule and give monthly progress reports so parents can track improvement from abroad.",
        ],
        topics: [
            t("CBSE, ICSE and Kerala syllabus", "Subject tutoring from KG to Class 12."),
            t("Flexible UAE timings", "Evenings and weekends in local time."),
            t("Core subjects", "Maths, science, English, social science, Hindi and Malayalam."),
            t("Senior classes", "Physics, chemistry, biology and maths for Classes 11 and 12."),
            t("Parent updates", "Monthly reports on attendance, topics and progress."),
        ],
        faqs: [
            q("Which UAE emirates do you serve?", "We teach students anywhere in the UAE, as classes are online."),
            q("Do you cover Indian-curriculum schools in the UAE?", "Yes. We teach CBSE, ICSE and Kerala State syllabi."),
            q("Can my child try a class first?", "Yes. You can book a free demo class before deciding."),
        ],
    },
    qatar: {
        description: "1:1 online tuition for students in Qatar: Doha families get CBSE, ICSE and Kerala syllabus tutors with flexible Qatar-time classes. Free demo class.",
        intro: [
            "Indian families in Doha and across Qatar often struggle to find tutors for the CBSE, ICSE or Kerala syllabus at convenient times. BrightPath offers live one-to-one online classes with tutors who teach those syllabi every day.",
            "Qatar is 2.5 hours behind IST. For example, 6:00 PM in Doha is 8:30 PM IST. We schedule classes around school hours and weekends, so students can learn without travelling.",
        ],
        topics: [
            t("Indian-curriculum tutoring", "CBSE, ICSE and Kerala State support from KG to Class 12."),
            t("Qatar-time scheduling", "After-school and weekend slots in local time."),
            t("Subject help", "Maths, science, English, social science, Hindi and Malayalam."),
            t("Board class preparation", "Class 10 and Class 12 revision with past papers."),
            t("Progress reporting", "Monthly reports shared with parents."),
        ],
        faqs: [
            q("What is the time difference between Qatar and India?", "Qatar is 2.5 hours behind IST. Our classes run from 5:00 AM to 11:00 PM IST, so Qatar students can pick after-school slots."),
            q("Do you teach Malayalam to children in Qatar?", "Yes. We offer Malayalam reading and writing foundation courses and school syllabus support."),
            q("Is there a free trial?", "Yes. You can book a free demo class."),
        ],
    },
    'saudi-arabia': {
        description: "1:1 online tuition for students in Saudi Arabia: Riyadh, Jeddah and Dammam families get CBSE, ICSE and Kerala syllabus tutors. Free demo class.",
        intro: [
            "Students in Riyadh, Jeddah, Dammam and across Saudi Arabia who follow the Indian curriculum can learn with BrightPath tutors online, one to one, without long commutes or fixed batch timings.",
            "Saudi Arabia is 2.5 hours behind IST. We schedule classes in the afternoon, evening or on weekends to match your child's school and family routine, and we send monthly progress updates to parents.",
        ],
        topics: [
            t("CBSE, ICSE and Kerala syllabus", "Tutors who teach these syllabi regularly."),
            t("City-independent classes", "Riyadh, Jeddah, Dammam, Khobar and anywhere with internet."),
            t("Core and senior subjects", "From primary maths and English to Class 12 science."),
            t("Malayalam and Hindi", "Language support for children living abroad."),
            t("Board exam practice", "Previous papers and revision plans."),
        ],
        faqs: [
            q("Can students in any Saudi city join?", "Yes. Classes are online, so students in any city can join."),
            q("What are the class timings for Saudi students?", "Classes can be scheduled between 5:00 AM and 11:00 PM IST. Saudi Arabia is 2.5 hours behind India, so evening slots in KSA are late evening in India."),
            q("Which syllabi do you support?", "CBSE, ICSE, Kerala State and IGCSE."),
        ],
    },
    oman: {
        description: "1:1 online tuition for students in Oman: Muscat, Salalah and Sohar families get CBSE, ICSE and Kerala syllabus tutors. Book a free demo class.",
        intro: [
            "Indian-curriculum students in Muscat, Salalah, Sohar and elsewhere in Oman can learn with BrightPath tutors in live one-to-one online sessions. This is useful where good subject tutors are hard to find or are available only in fixed batches.",
            "Oman is 1.5 hours behind IST. We schedule after-school and weekend classes in Oman time and provide monthly progress reports for parents.",
        ],
        topics: [
            t("Indian syllabus support", "CBSE, ICSE and Kerala State from KG to Class 12."),
            t("Oman-friendly timings", "After-school and weekend slots."),
            t("Subject tutoring", "Maths, science, English, social science and languages."),
            t("Senior secondary", "Physics, chemistry, biology and maths for Classes 11 and 12."),
            t("Malayalam foundation", "Reading and writing courses for Gulf-born children."),
        ],
        faqs: [
            q("Is there any difference in classes for students in Oman?", "The classes are the same live one-to-one sessions, scheduled in Oman time. Oman is 1.5 hours behind IST."),
            q("Can you teach Class 10 and 12 board students in Oman?", "Yes. We support board preparation with revision and past papers."),
            q("How do I start?", "Book a free demo class. The tutor will assess your child and suggest a plan."),
        ],
    },
    kuwait: {
        description: "1:1 online tuition for students in Kuwait: CBSE, ICSE and Kerala syllabus tutors with flexible Kuwait-time classes and monthly reports. Free demo.",
        intro: [
            "Families in Kuwait City, Salmiya, Hawally and other areas can access BrightPath's one-to-one tutors online for the CBSE, ICSE or Kerala syllabus. There is no commute, and the tutor works only with your child.",
            "Kuwait is 2.5 hours behind IST. We arrange classes around your child's school timetable and weekends and share a monthly report with parents.",
        ],
        topics: [
            t("Indian-curriculum tutoring", "CBSE, ICSE and Kerala State syllabi from KG to Class 12."),
            t("Kuwait-time classes", "After-school and weekend slots."),
            t("Core subjects", "Maths, science, English, social science, Hindi and Malayalam."),
            t("Board preparation", "Class 10 and 12 revision plans."),
            t("Parent updates", "Monthly progress reports and regular communication."),
        ],
        faqs: [
            q("Which areas of Kuwait do you cover?", "We teach students anywhere in Kuwait, because classes are online."),
            q("What is the time difference between Kuwait and India?", "Kuwait is 2.5 hours behind IST."),
            q("Can I book a trial class?", "Yes. A free demo class is available."),
        ],
    },
    bahrain: {
        description: "1:1 online tuition for students in Bahrain: Manama families get CBSE, ICSE and Kerala syllabus tutors in Bahrain-time slots. Book a free demo class.",
        intro: [
            "Indian-curriculum students in Manama, Riffa, Muharraq and across Bahrain can learn with BrightPath tutors in personal online classes. Lessons follow the school textbooks and the tutor's focus stays on your child's specific gaps.",
            "Bahrain is 2.5 hours behind IST. We schedule evening and weekend classes in local time and send parents monthly progress reports.",
        ],
        topics: [
            t("CBSE, ICSE and Kerala syllabus", "From primary classes to Class 12."),
            t("Bahrain-time classes", "Evening and weekend slots."),
            t("Subject support", "Maths, science, English, social science and languages."),
            t("Board class preparation", "Revision and previous papers for Classes 10 and 12."),
            t("Progress tracking", "Monthly reports on attendance and topics."),
        ],
        faqs: [
            q("Do you serve all of Bahrain?", "Yes. Classes are online and available anywhere in Bahrain."),
            q("Which subjects can my child study?", "Maths, science, English, social science, Hindi, Malayalam and, for senior classes, physics, chemistry and biology."),
            q("How long is the demo class?", "The free demo is arranged after you submit the enquiry. The team will confirm the details with you."),
        ],
    },
    chennai: {
        description: "1:1 online tuition for students in Chennai: CBSE and ICSE subject tutors, board exam practice and flexible timings from home. Book a free demo class.",
        intro: [
            "Chennai's school commutes and packed timetables leave little time for travelling to a tuition centre. BrightPath brings one-to-one tutors to your home online, with classes scheduled around school and activities in IST.",
            "We support CBSE and ICSE students from primary classes to Class 12 and teach English, maths, science, social science, Hindi and Malayalam. If your child follows another State syllabus, share the details in the free demo and we will advise honestly on what we can support.",
        ],
        topics: [
            t("CBSE and ICSE support", "NCERT and CISCE aligned lessons."),
            t("No travel", "Classes at home, saving commute time."),
            t("Board preparation", "Class 10 and 12 revision and past papers."),
            t("Science and maths", "Concepts, numericals and exam practice."),
            t("Flexible schedules", "Classes from 5:00 AM to 11:00 PM IST."),
        ],
        faqs: [
            q("Do you teach the Tamil Nadu State Board syllabus?", "Our tutors mainly support CBSE, ICSE, Kerala State and IGCSE. If you need another syllabus, tell us in the free demo."),
            q("Are classes in IST?", "Yes. Chennai follows IST, the same as our class schedule."),
            q("Can my child learn Hindi or Malayalam with you?", "Yes. Hindi and Malayalam tutoring is available."),
        ],
    },
    bangalore: {
        description: "1:1 online tuition for students in Bangalore: CBSE, ICSE and Kerala syllabus tutors, no commute, flexible IST timings. Book a free demo class today.",
        intro: [
            "Bangalore's traffic makes evening tuition trips tiring for both children and parents. Online one-to-one classes with BrightPath let students learn at home with a tutor who focuses on their pace and school syllabus.",
            "We teach CBSE and ICSE students from KG to Class 12 and many Malayali families in Bangalore also use us for Kerala syllabus and Malayalam foundation. Classes run in IST from 5:00 AM to 11:00 PM.",
        ],
        topics: [
            t("CBSE and ICSE tutoring", "NCERT and CISCE aligned lessons."),
            t("Malayalam for Bangalore Malayalis", "Reading and writing courses for children raised outside Kerala."),
            t("Traffic-free classes", "Learn at home after school."),
            t("Senior subjects", "Physics, chemistry, biology and maths for Classes 11 and 12."),
            t("Entrance foundation", "Concept-first teaching that supports NEET, JEE and CUET preparation."),
        ],
        faqs: [
            q("Do you teach Malayalam to children in Bangalore?", "Yes. We offer Malayalam foundation and school syllabus support."),
            q("Is there a time difference?", "No. Bangalore follows IST, the same as our class schedule."),
            q("Which boards do you cover?", "CBSE, ICSE, Kerala State and IGCSE."),
        ],
    },
    coimbatore: {
        description: "1:1 online tuition for students in Coimbatore: CBSE, ICSE and Kerala syllabus tutors with flexible IST classes and board exam practice. Free demo.",
        intro: [
            "Coimbatore has a large Malayali community and many CBSE and ICSE schools. BrightPath serves these families with one-to-one online tutoring that follows the syllabus the child studies at school.",
            "Because Coimbatore is close to Kerala, many students prefer a Malayalam or bilingual explanation. Our tutors can teach in English, Malayalam or a mix, and classes run in IST between 5:00 AM and 11:00 PM.",
        ],
        topics: [
            t("CBSE, ICSE and Kerala syllabus", "Support from KG to Class 12."),
            t("Bilingual explanations", "English and Malayalam as needed."),
            t("Board class revision", "Class 10 and 12 plans with past papers."),
            t("Subject tutoring", "Maths, science, English, social science and languages."),
            t("Flexible schedules", "After-school and weekend classes."),
        ],
        faqs: [
            q("Can the tutor explain in Malayalam?", "Yes. Tutors can teach in Malayalam, English or a mix."),
            q("Are classes at home?", "Yes. Classes are online, so your child can learn from home."),
            q("Do you teach all classes?", "We teach from KG to Class 12."),
        ],
    },
    hyderabad: {
        description: "1:1 online tuition for students in Hyderabad: CBSE and ICSE tutors, board exam practice and entrance foundation, with flexible IST classes. Free demo.",
        intro: [
            "Hyderabad students often balance long school days with competitive exam preparation. BrightPath offers one-to-one online tutoring so students can fill gaps in school subjects without adding commute time to a busy day.",
            "We support CBSE and ICSE syllabi from KG to Class 12, with extra focus on maths and science for senior students. Classes run in IST, and parents receive monthly progress reports.",
        ],
        topics: [
            t("CBSE and ICSE tutoring", "Syllabus-aligned lessons and school test preparation."),
            t("Maths and science focus", "Concept clarity and numerical practice for Classes 9 to 12."),
            t("Entrance foundation", "Strong fundamentals that support JEE, NEET and CUET preparation."),
            t("Learn at home", "No travel time between school, coaching and tuition."),
            t("Flexible schedules", "Slots between 5:00 AM and 11:00 PM IST."),
        ],
        faqs: [
            q("Do you teach the Telangana State syllabus?", "Our tutors mainly support CBSE, ICSE, Kerala State and IGCSE. For another syllabus, please ask us in the free demo."),
            q("Can you work around coaching classes?", "Yes. Timings are flexible, and we can plan sessions around school and coaching."),
            q("Can I book a trial?", "Yes. A free demo class is available."),
        ],
    },
};

const CONTENT: Record<string, Record<string, TuitionContent>> = {
    'tuition-by-classes': classes,
    'tuition-by-subject': subjects,
    'tuition-by-board': boards,
    'tuition-by-location': locations,
};

export function getTuitionContent(category: string, slug: string): TuitionContent | null {
    return CONTENT[category]?.[slug] ?? null;
}
