import Link from "next/link";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import MIniCard from "@/components/MIniCard";

export default function Huertas() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/huerta').then(response => {
      setProducts(response.data);
    });
  }, []);

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <MIniCard product={product} />
        ))}
      </div>
    </Layout>
  );
}
