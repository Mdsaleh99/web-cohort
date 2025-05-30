"use client"

import todoService from "@/services/todoService";
import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState([])
  useEffect(() => {
    loadTodos()
  }, [])
  const loadTodos = async () => {
    try {
      const data = await todoService.getAllTodos()
      setTodos(data)
    } catch (error) {
      
    }
  }
  return (
    <div>
      Testing
    </div>
  );
}
