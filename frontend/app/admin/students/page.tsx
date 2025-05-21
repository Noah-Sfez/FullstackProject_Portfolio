"use client";

import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { Table } from "antd";
import Link from "next/link";

import { Project } from "@/model/Project";
import { gsap } from "gsap";
import { Candidat } from "@/model/Candidat";

export default function AdminProjectsPage() {
  /* ---------------- State ---------------- */
  const [candidates, setCandidates] = useState<Project[]>([]);
  const cardRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- Fetch projects ---------------- */
  const fetchProjects = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`);
    try {
      const data = await res.json();
      console.log("Réponse API projets admin :", data);
      const parsed = data["hydra:member"] || data.member || data;
      setCandidates(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("Erreur de parsing JSON :", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ---------------- Animations ---------------- */
  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: "power2.out",
      });
      gsap.set(".new-btn", { scale: 1 });
      const tl = gsap
        .timeline({ paused: true })
        .to(".new-btn", {
          scale: 1.05,
          duration: 0.15,
          ease: "power1.inOut",
        })
        .to(".new-btn", {
          scale: 1,
          duration: 0.15,
          ease: "power1.inOut",
        });
      document
        .querySelectorAll<HTMLButtonElement>(".new-btn")
        .forEach((btn) => {
          btn.addEventListener("mouseenter", () => tl.play());
          btn.addEventListener("mouseleave", () => tl.reverse());
        });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  /* ---------------- Table columns ---------------- */
  const columns = [
    {
      title: "Nom",
      render: (record: Candidat) => record.surname,
    },
    {
      title: "Prénom",
      render: (record: Candidat) => record.name,
    },
  ];

  /* ---------------- JSX ---------------- */
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-200/50 via-orange-100 to-indigo-300 px-4 py-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-28 h-80 w-80 rounded-full bg-indigo-300 opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-purple-300 opacity-20 blur-3xl" />

      <section
        ref={cardRef}
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white/70 p-6 shadow-2xl backdrop-blur-md md:p-8"
      >
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-extrabold text-indigo-700 md:text-3xl">
            Étudiants ⚙️
          </h1>
        </div>

        {/* Table */}
        <Table
          rowKey="id"
          dataSource={candidates}
          columns={columns}
          pagination={{ pageSize: 8 }}
          className="rounded-lg"
        />
      </section>
    </main>
  );
}
