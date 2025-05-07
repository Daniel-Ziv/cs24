import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { courseStyles } from "../config/courseStyles";
import { useNavigate } from "react-router-dom";

export const courses = {
  year1: [
    {
      id: 1,
      name: "מבוא למדעי המחשב",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "מושגי יסוד במדעי המחשב ותכנות",
      creator: "עידן מרמור",
      hours: 90,
      price: 299,
      originalPrice: 499,
      episodes: [
        {
          id: 1,
          title: "מבוא למדעי המחשב - שיעור 1",
          duration: "45:00",
          description: "הכרות עם מושגי יסוד במדעי המחשב",
          videoUrl: "https://example.com/video1",
          completed: false,
        },
        {
          id: 2,
          title: "מבוא למדעי המחשב - שיעור 2",
          duration: "52:30",
          description: "מבנה המחשב והמעבד",
          videoUrl: "https://example.com/video2",
          completed: false,
        },
        {
          id: 3,
          title: "מבוא למדעי המחשב - שיעור 3",
          duration: "48:15",
          description: "מערכות מספרים ובינאריות",
          videoUrl: "https://example.com/video3",
          completed: false,
        },
      ],
    },
    {
      id: 2,
      name: "מבני נתונים",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "לימוד מבני נתונים ואלגוריתמים בסיסיים",
      creator: "עידן מרמור",
      hours: 75,
      price: 349,
      originalPrice: 599,
      episodes: [
        {
          id: 1,
          title: "מבני נתונים - שיעור 1",
          duration: "50:00",
          description: "מבוא למבני נתונים",
          videoUrl: "https://example.com/video1",
          completed: false,
        },
        {
          id: 2,
          title: "מבני נתונים - שיעור 2",
          duration: "55:30",
          description: "מערכים ורשימות מקושרות",
          videoUrl: "https://example.com/video2",
          completed: false,
        },
        {
          id: 3,
          title: "מבני נתונים - שיעור 3",
          duration: "48:15",
          description: "עצים וגרפים",
          videoUrl: "https://example.com/video3",
          completed: false,
        },
      ],
    },
    {
      id: 3,
      name: "מערכות המחשב",
      image:
        "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "הבנת חומרת המחשב וארכיטקטורה",
      creator: "עידן מרמור",
      hours: 60,
      price: 399,
      originalPrice: 699,
      episodes: [
        {
          id: 1,
          title: "מערכות המחשב - שיעור 1",
          duration: "45:00",
          description: "מבוא למערכות מחשב",
          videoUrl: "https://example.com/video1",
          completed: false,
        },
        {
          id: 2,
          title: "מערכות המחשב - שיעור 2",
          duration: "52:30",
          description: "ארכיטקטורת מעבד",
          videoUrl: "https://example.com/video2",
          completed: false,
        },
        {
          id: 3,
          title: "מערכות המחשב - שיעור 3",
          duration: "48:15",
          description: "זיכרון וקלט/פלט",
          videoUrl: "https://example.com/video3",
          completed: false,
        },
      ],
    },
    {
      id: 4,
      name: "אלגברה לינארית",
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "מבוא לאלגברה לינארית ויישומיה במדעי המחשב",
      creator: "עידן מרמור",
      hours: 60,
      price: 299,
      originalPrice: 499,
      episodes: [
        {
          id: 1,
          title: "אלגברה לינארית - שיעור 1",
          duration: "45:00",
          description: "מבוא לאלגברה לינארית",
          videoUrl: "https://example.com/video1",
          completed: false,
        },
        {
          id: 2,
          title: "אלגברה לינארית - שיעור 2",
          duration: "52:30",
          description: "מטריצות ופעולות",
          videoUrl: "https://example.com/video2",
          completed: false,
        },
        {
          id: 3,
          title: "אלגברה לינארית - שיעור 3",
          duration: "48:15",
          description: "מרחבים וקטוריים",
          videoUrl: "https://example.com/video3",
          completed: false,
        },
      ],
    },
    {
      id: 5,
      name: "חשבון אינפיניטסימלי",
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "חשבון דיפרנציאלי ואינטגרלי למדעי המחשב",
      creator: "עידן מרמור",
      hours: 60,
      price: 299,
      originalPrice: 499,
      episodes: [
        {
          id: 1,
          title: "חשבון אינפיניטסימלי - שיעור 1",
          duration: "45:00",
          description: "מבוא לחשבון דיפרנציאלי",
          videoUrl: "https://example.com/video1",
          completed: false,
        },
        {
          id: 2,
          title: "חשבון אינפיניטסימלי - שיעור 2",
          duration: "52:30",
          description: "נגזרות וכללי גזירה",
          videoUrl: "https://example.com/video2",
          completed: false,
        },
        {
          id: 3,
          title: "חשבון אינפיניטסימלי - שיעור 3",
          duration: "48:15",
          description: "אינטגרלים",
          videoUrl: "https://example.com/video3",
          completed: false,
        },
      ],
    },
  ],
  year2: [
    {
      id: 6,
      name: "מערכות הפעלה",
      image:
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "לימוד מושגי יסוד במערכות הפעלה",
      creator: "עידן מרמור",
      hours: 75,
      price: 399,
      originalPrice: 699,
      episodes: [
        {
          id: 1,
          title: "מערכות הפעלה - שיעור 1",
          duration: "45:00",
          description: "מבוא למערכות הפעלה",
          videoUrl: "https://example.com/video1",
          completed: false,
        },
        {
          id: 2,
          title: "מערכות הפעלה - שיעור 2",
          duration: "52:30",
          description: "ניהול תהליכים",
          videoUrl: "https://example.com/video2",
          completed: false,
        },
        {
          id: 3,
          title: "מערכות הפעלה - שיעור 3",
          duration: "48:15",
          description: "ניהול זיכרון",
          videoUrl: "https://example.com/video3",
          completed: false,
        },
      ],
    },
    {
      id: 7,
      name: "מערכות בסיסי נתונים",
      image:
        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "תכנון, מימוש וניהול בסיסי נתונים",
      creator: "עידן מרמור",
      hours: 60,
      price: 349,
      originalPrice: 599,
      episodes: [
        {
          id: 1,
          title: "מערכות בסיסי נתונים - שיעור 1",
          duration: "50:00",
          description: "מבוא למערכות בסיסי נתונים",
          videoUrl: "https://example.com/video1",
          completed: false,
        },
        {
          id: 2,
          title: "מערכות בסיסי נתונים - שיעור 2",
          duration: "55:30",
          description: "מימוש וניהול מערכות בסיסי נתונים",
          videoUrl: "https://example.com/video2",
          completed: false,
        },
        {
          id: 3,
          title: "מערכות בסיסי נתונים - שיעור 3",
          duration: "48:15",
          description: "אלגוריתמים וארכיטקטורות",
          videoUrl: "https://example.com/video3",
          completed: false,
        },
      ],
    },
    {
      id: 8,
      name: "הנדסת תוכנה",
      image:
        "https://images.unsplash.com/photo-1555066931-bf19f8fd80f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
      description: "מתודולוגיות ופרקטיקות בפיתוח תוכנה",
      creator: "עידן מרמור",
      hours: 60,
      price: 399,
      originalPrice: 699,
      episodes: [
        {
          id: 1,
          title: "הנדסת תוכנה - שיעור 1",
          duration: "45:00",
          description: "מבוא להנדסת תוכנה",
          videoUrl: "https://example.com/video1",
          completed: false,
        },
        {
          id: 2,
          title: "הנדסת תוכנה - שיעור 2",
          duration: "52:30",
          description: "מתודולוגיות וארכיטקטורות",
          videoUrl: "https://example.com/video2",
          completed: false,
        },
        {
          id: 3,
          title: "הנדסת תוכנה - שיעור 3",
          duration: "48:15",
          description: "פרקטיקות ואלגוריתמים",
          videoUrl: "https://example.com/video3",
          completed: false,
        },
      ],
    },
    {
      id: 9,
      name: "תכנות מונחה עצמים",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "פיתוח תוכנה בפרדיגמת תכנות מונחה עצמים",
      creator: "עידן מרמור",
      hours: 75,
      price: 449,
      originalPrice: 799,
      episodes: [
        {
          id: 1,
          title: "תכנות מונחה עצמים - שיעור 1",
          duration: "45:00",
          description: "מבוא לתכנות מונחה עצמים",
          videoUrl: "https://example.com/video1",
          completed: false,
        },
        {
          id: 2,
          title: "תכנות מונחה עצמים - שיעור 2",
          duration: "52:30",
          description: "מבני מונחה עצמים וארכיטקטורות",
          videoUrl: "https://example.com/video2",
          completed: false,
        },
        {
          id: 3,
          title: "תכנות מונחה עצמים - שיעור 3",
          duration: "48:15",
          description: "פרקטיקות ואלגוריתמים",
          videoUrl: "https://example.com/video3",
          completed: false,
        },
      ],
    },
    {
      id: 10,
      name: "ארכיטקטורת מחשבים",
      image:
        "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "תכנון וארכיטקטורה של מערכות מחשב",
      creator: "עידן מרמור",
      hours: 60,
      price: 399,
      originalPrice: 699,
      episodes: [
        {
          id: 1,
          title: "ארכיטקטורת מחשבים - שיעור 1",
          duration: "45:00",
          description: "מבוא לארכיטקטורת מחשבים",
          videoUrl: "https://example.com/video1",
          completed: false,
        },
        {
          id: 2,
          title: "ארכיטקטורת מחשבים - שיעור 2",
          duration: "52:30",
          description: "ארכיטקטורות מחשב",
          videoUrl: "https://example.com/video2",
          completed: false,
        },
        {
          id: 3,
          title: "ארכיטקטורת מחשבים - שיעור 3",
          duration: "48:15",
          description: "אלגוריתמים וארכיטקטורות",
          videoUrl: "https://example.com/video3",
          completed: false,
        },
      ],
    },
    {
      id: 11,
      name: "אלגוריתמים 1",
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "מבוא לאלגוריתמים וניתוח סיבוכיות",
      creator: "עידן מרמור",
      hours: 75,
      price: 399,
      originalPrice: 699,
      episodes: [
        {
          id: 1,
          title: "אלגוריתמים 1 - שיעור 1",
          duration: "45:00",
          description: "מבוא לאלגוריתמים וניתוח סיבוכיות",
          videoUrl: "https://example.com/video1",
          completed: false,
        },
        {
          id: 2,
          title: "אלגוריתמים 1 - שיעור 2",
          duration: "52:30",
          description: "אלגוריתמים סופיים וניתוח סיבוכיות",
          videoUrl: "https://example.com/video2",
          completed: false,
        },
        {
          id: 3,
          title: "אלגוריתמים 1 - שיעור 3",
          duration: "48:15",
          description: "אלגוריתמים מתקדמים וניתוח סיבוכיות",
          videoUrl: "https://example.com/video3",
          completed: false,
        },
      ],
    },
    {
      id: 12,
      name: "אלגוריתמים 2",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "אלגוריתמים מתקדמים וניתוח ביצועים",
      creator: "עידן מרמור",
      hours: 75,
      price: 449,
      originalPrice: 799,
      episodes: [
        {
          id: 1,
          title: "אלגוריתמים 2 - שיעור 1",
          duration: "45:00",
          description: "אלגוריתמים מתקדמים וניתוח סיבוכיות",
          videoUrl: "https://example.com/video1",
          completed: false,
        },
        {
          id: 2,
          title: "אלגוריתמים 2 - שיעור 2",
          duration: "52:30",
          description: "אלגוריתמים מתקדמים וניתוח סיבוכיות",
          videoUrl: "https://example.com/video2",
          completed: false,
        },
        {
          id: 3,
          title: "אלגוריתמים 2 - שיעור 3",
          duration: "48:15",
          description: "אלגוריתמים מתקדמים וניתוח סיבוכיות",
          videoUrl: "https://example.com/video3",
          completed: false,
        },
      ],
    },
  ],
  year3: [
    {
      id: 13,
      name: "אוטומטים ושפות פורמליות",
      image:
        "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "לימוד מערכות אוטומציה ורובוטיקה",
      creator: "עידן מרמור",
      hours: 60,
      price: 449,
      originalPrice: 799,
      episodes: [
        {
          id: 1,
          title: "אוטומטים - שיעור 1",
          duration: "45:00",
          description: "מבוא לאוטומטים",
          videoUrl: "https://example.com/video1",
          completed: false,
        },
        {
          id: 2,
          title: "אוטומטים - שיעור 2",
          duration: "52:30",
          description: "אוטומטים סופיים",
          videoUrl: "https://example.com/video2",
          completed: false,
        },
        {
          id: 3,
          title: "אוטומטים - שיעור 3",
          duration: "48:15",
          description: "שפות פורמליות",
          videoUrl: "https://example.com/video3",
          completed: false,
        },
      ],
    },
    {
      id: 14,
      name: "חישוביות וסיבוכיות",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      description: "יסודות תיאורטיים של חישוביות",
      creator: "עידן מרמור",
      hours: 60,
      price: 299,
      originalPrice: 499,
      episodes: [
        {
          id: 1,
          title: "חישוביות וסיבוכיות - שיעור 1",
          duration: "45:00",
          description: "יסודות תיאורטיים של חישוביות",
          videoUrl: "https://example.com/video1",
          completed: false,
        },
        {
          id: 2,
          title: "חישוביות וסיבוכיות - שיעור 2",
          duration: "52:30",
          description: "חישוביות וסיבוכיות במדעי המחשב",
          videoUrl: "https://example.com/video2",
          completed: false,
        },
        {
          id: 3,
          title: "חישוביות וסיבוכיות - שיעור 3",
          duration: "48:15",
          description: "יסודות תיאורטיים של חישוביות",
          videoUrl: "https://example.com/video3",
          completed: false,
        },
      ],
    },
  ],
};

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
      <div className="relative h-48">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-lg font-semibold">למידע נוסף</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{course.name}</h3>
        <p className="text-gray-600 mb-3">{course.description}</p>
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex items-center space-x-2">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-gray-700">מרצה: {course.creator}</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-gray-700">{course.hours} שעות</span>
          </div>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
          onClick={() => navigate(`/course/${course.id}`)}
        >
          צפה עכשיו
        </button>
      </div>
    </div>
  );
};

const YearSection = ({ year, courses }) => (
  <div className="mb-12">
    <h2 className="text-3xl font-bold text-gray-800 mb-6">{year}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  </div>
);

const Courses = () => {
  const [selectedYear, setSelectedYear] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const styles = courseStyles.cs;
  const navigate = useNavigate();

  const filteredCourses = {
    year1: courses.year1.filter(
      (course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    year2: courses.year2.filter(
      (course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    year3: courses.year3.filter(
      (course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  };

  const renderCourses = () => {
    if (selectedYear === "all") {
      return (
        <>
          {filteredCourses.year1.length > 0 && (
            <YearSection year="שנה א'" courses={filteredCourses.year1} />
          )}
          {filteredCourses.year2.length > 0 && (
            <YearSection year="שנה ב'" courses={filteredCourses.year2} />
          )}
          {filteredCourses.year3.length > 0 && (
            <YearSection year="שנה ג'" courses={filteredCourses.year3} />
          )}
        </>
      );
    }

    const yearMap = {
      year1: "שנה א'",
      year2: "שנה ב'",
      year3: "שנה ג'",
    };

    return filteredCourses[selectedYear].length > 0 ? (
      <YearSection
        year={yearMap[selectedYear]}
        courses={filteredCourses[selectedYear]}
      />
    ) : (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">לא נמצאו קורסים</p>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${styles.bgGradient}`}
      dir="rtl"
    >
      <Navbar courseType="cs" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between"></div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedYear("all")}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                  selectedYear === "all"
                    ? styles.buttonPrimary
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                כל השנים
              </button>
              <button
                onClick={() => setSelectedYear("year1")}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                  selectedYear === "year1"
                    ? styles.buttonPrimary
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                שנה א'
              </button>
              <button
                onClick={() => setSelectedYear("year2")}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                  selectedYear === "year2"
                    ? styles.buttonPrimary
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                שנה ב'
              </button>
              <button
                onClick={() => setSelectedYear("year3")}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                  selectedYear === "year3"
                    ? styles.buttonPrimary
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                שנה ג'
              </button>
            </div>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="חיפוש קורסים..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="rtl"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">{renderCourses()}</div>
      </div>

      <style jsx>{`
        @keyframes slide {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }
        .animate-slide {
          animation: slide 4s ease-in-out infinite;
        }
        @keyframes tilt {
          0%,
          50%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(1deg);
          }
          75% {
            transform: rotate(-1deg);
          }
        }
        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Courses;
