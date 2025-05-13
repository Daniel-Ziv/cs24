import { GraduationCap, Calendar, Award, BookOpen } from "lucide-react"

export default function EducationProfileSection({ tutor, styles }) {
  if (!tutor) return null;

  const average =
    tutor.grades?.length > 0
      ? (
          tutor.grades.reduce((sum, g) => sum + Number(g.grade), 0) /
          tutor.grades.length
        ).toFixed(1)
      : "N/A";
  return (
    <section className="py-8 -mt-12 -mb-12" dir="rtl">
      <div className="w-full py-8">
        <div className="flex items-center gap-3 border-b pb-6 mb-8">
          <GraduationCap className={`h-6 w-6 ${styles.iconColor}`} />
          <h2 className={`text-2xl font-bold ${styles.textColor}`}>השכלה</h2>
        </div>

        <div className="mb-8">
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 ${styles.subjectBg} p-4 rounded-lg`}>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{tutor.fieldOfStudy}</h3>
              <div className="flex items-center mt-1 text-gray-600">
                <BookOpen className="h-4 w-4 mr-2 ml-2" />
                <span className="mb-1">{tutor.institution}</span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-2 ml-8 sm:mt-0">
              <Calendar className={`h-4 w-4 mr-2 ml-2 ${styles.iconColor}`} />
              <span>
              {tutor.endDate} — {tutor.startDate} 
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right rounded-xl overflow-hidden">
              <thead className={`border-b ${styles.cardBorder}`}>
                <tr>
                  <th className={`px-4 py-3 text-sm font-bold ${styles.textColor}`}>מקצוע</th>
                  <th className={`px-4 py-3 text-sm font-bold ${styles.textColor}`}>שנה</th>
                  <th className={`px-4 py-3 text-sm font-bold ${styles.textColor}`}>ציון</th>
                </tr>
              </thead>
              <tbody>
                {tutor.grades?.map((grade, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? styles.bgLight : ""}`}
                  >
                    <td className={`px-4 py-3 text-sm ${styles.textColor}`}>{grade.subject}</td>
                    <td className={`px-4 py-3 text-sm ${styles.textColor}`}>{grade.year}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-bold ${styles.textSecondary}`}>
                        {grade.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm">
            <div className={`flex items-center gap-1 text-lg ${styles.textColor}`}>
              <span className="font-bold">ממוצע:</span> {average}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
