import clientPromise from "../../lib/mongodb";

/**
 * This file only exists if a developer wants to create random data, this is the content that is displayed in components/FloatingCards
 * This is never called by the user
 * @param {req.body.count}  number of random plans to be generated
 * Writes to the database collection examplePLans the generated plans- these plans don't have schedules just the string ("{course} in {number} {time}")
 * @returns success and message of the action
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { count } = req.body;
    if (!count || typeof count !== "number" || count <= 0) {
      res.status(400).json({
        success: false,
        message: "A valid count (positive number) is required",
      });
      return;
    }

    try {
      const client = await clientPromise;
      const db = client.db("user_database");
      const plansCollection = db.collection("examplePlans");

      // Generate random data
      //This array was generated by AI
      const courses = [
        "Algebra I",
        "Algebra II",
        "Geometry",
        "Trigonometry",
        "Calculus I",
        "Calculus II",
        "Multivariable Calculus",
        "AP Calculus AB",
        "AP Calculus BC",
        "Pre-Algebra",
        "Number Theory",
        "Differential Equations",
        "Complex Analysis",
        "AP Statistics",
        "Probability and Statistics",
        "Data Analysis and Probability",
        "Mathematical Logic",
        "Advanced Placement Statistics",
        "Financial Mathematics",

        "General Biology",
        "Molecular Biology",
        "Cellular Biology",
        "AP Biology",
        "Genetics",
        "Ecology",
        "Evolutionary Biology",
        "Anatomy and Physiology",
        "Microbiology",
        "Marine Biology",
        "Botany",
        "Zoology",

        "General Chemistry",
        "Organic Chemistry",
        "Inorganic Chemistry",
        "Analytical Chemistry",
        "Physical Chemistry",
        "AP Chemistry",
        "Biochemistry",
        "Environmental Chemistry",

        "General Physics",
        "Mechanics",
        "Electromagnetism",
        "Thermodynamics",
        "Quantum Physics",
        "Optics",
        "Relativity",
        "AP Physics 1",
        "AP Physics 2",
        "AP Physics C: Mechanics",
        "AP Physics C: Electricity and Magnetism",
        "Astrophysics",

        "Geology",
        "Meteorology",
        "Oceanography",
        "Environmental Science",
        "AP Environmental Science",
        "Astronomy",
        "Climate Science",
        "Paleontology",

        "AP Computer Science A",
        "AP Computer Science Principles",
        "Data Structures and Algorithms",
        "Object-Oriented Programming",
        "Machine Learning",
        "Artificial Intelligence",
        "Cybersecurity",
        "Web Development",
        "Mobile App Development",
        "Game Design and Development",
        "Database Systems",
        "Operating Systems",
        "Computer Networks",
        "Computer Graphics",

        "Early American History",
        "Civil War and Reconstruction",
        "AP US History",
        "Post-War America",
        "US Government and Civics",
        "American Economic History",
        "History of the American West",

        "Ancient Civilizations",
        "Medieval History",
        "Renaissance and Reformation",
        "Enlightenment and Revolution",
        "20th Century World Wars",
        "Modern Global History",
        "AP World History",
        "History of Asia",
        "African History",
        "European History",
        "History of the Middle East",
        "Latin American History",

        "English Literature",
        "American Literature",
        "British Literature",
        "World Literature",
        "Creative Writing",
        "Journalism",
        "AP English Language and Composition",
        "AP English Literature and Composition",
        "Shakespearean Studies",
        "Poetry and Prose",
        "Drama and Playwriting",
        "Rhetoric and Composition",

        "Spanish I",
        "Spanish II",
        "Spanish III",
        "Spanish IV",
        "French I",
        "French II",
        "French III",
        "French IV",
        "German I",
        "German II",
        "German III",
        "German IV",
        "Chinese (Mandarin) I",
        "Chinese (Mandarin) II",
        "Chinese (Mandarin) III",
        "Chinese (Mandarin) IV",
        "Japanese I",
        "Japanese II",
        "Japanese III",
        "Japanese IV",
        "Latin I",
        "Latin II",
        "Latin III",
        "Latin IV",
        "Russian I",
        "Russian II",
        "Russian III",
        "Russian IV",
        "Arabic I",
        "Arabic II",
        "Arabic III",
        "Arabic IV",
        "Italian I",
        "Italian II",
        "Italian III",
        "Italian IV",

        "Microeconomics",
        "Macroeconomics",
        "AP Microeconomics",
        "AP Macroeconomics",
        "Business Studies",
        "Entrepreneurship",
        "Marketing and Advertising",
        "Finance and Accounting",
        "International Business",
        "Personal Finance",

        "Visual Arts",
        "AP Studio Art",
        "Art History",
        "Digital Media and Design",
        "Photography",
        "Film Studies",
        "Theater Arts",
        "Music Theory",
        "AP Music Theory",
        "Choir and Vocal Performance",
        "Instrumental Music",

        "Psychology",
        "AP Psychology",
        "Sociology",
        "Anthropology",
        "Philosophy",
        "AP Human Geography",
        "Political Science",
        "Robotics",
        "Engineering Design",
        "AP Seminar",
        "AP Research",
        "Ethics and Morality",
        "Public Speaking",
        "Debate and Argumentation",
      ];

      const times = ["Days", "Weeks", "Months"];
      const randomPlans = Array.from({ length: count }).map(() => ({
        username: "testdata",
        topic: courses[Math.floor(Math.random() * courses.length)],
        number: Math.floor(Math.random() * 5) + 1,
        time: times[Math.floor(Math.random() * times.length)],
      }));

      const result = await plansCollection.insertMany(randomPlans);

      res.status(200).json({
        success: true,
        message: `${result.insertedCount} documents inserted successfully.`,
        insertedIds: result.insertedIds,
      });
    } catch (error) {
      console.error("Error inserting data into MongoDB:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} is not allowed`,
    });
  }
}
