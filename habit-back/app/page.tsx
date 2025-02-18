// app/page.tsx
"use client"
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}