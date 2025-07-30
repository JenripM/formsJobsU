"use client";
import React, { useState } from "react";
import useFirestore from "../../hooks/useFirestore"; // Asegúrate de que este hook esté configurado
import { createClient } from "@supabase/supabase-js";

// Configura tu cliente de Supabase
const supabase = createClient(
  "https://lkgncdyfimsdbtymiroe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrZ25jZHlmaW1zZGJ0eW1pcm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1Mzg0ODgsImV4cCI6MjA2OTExNDQ4OH0.ZkabFw7Myq3x4tYCgVZCjzABSU2X7tUMDrxhCM6vWaI"
);

export default function FormAddPractica() {
  const { addDocument, loading, error } = useFirestore(); // Este hook agrega un documento a Firestore

  // Estados para los campos del formulario
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [logo, setLogo] = useState<string>(""); // Puede ser un archivo o URL
  const [descripcion, setDescripcion] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [url, setUrl] = useState("");
  const [isOtherLogo, setIsOtherLogo] = useState(false); // Para saber si se seleccionó "Otros" en el logo
  const [uploading, setUploading] = useState(false);
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string>("");

  // Función para subir el logo a Supabase
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const filePath = `empresas/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("empresas") // Asegúrate de que este sea tu bucket
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("empresas")
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        setUploadedLogoUrl(publicUrlData.publicUrl);
        setLogo(publicUrlData.publicUrl); // Establecer la URL de la imagen subida
        alert("Logo subido correctamente");
      } else {
        throw new Error("No se pudo obtener la URL pública");
      }
    } catch (err) {
      console.error(err);
      alert("Error al subir el logo.");
    } finally {
      setUploading(false);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos estén completos
    if (
      !title.trim() ||
      !company.trim() ||
      !descripcion.trim() ||
      !location.trim() ||
      !salary.trim() ||
      !url.trim()
    ) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const data = {
      title,
      company,
      logo: uploadedLogoUrl || logo, // Guardar la URL del logo, ya sea cargado o proporcionado
      descripcion,
      location,
      salary,
      url,
      fecha_agregado: new Date(),
    };

    try {
      const id = await addDocument("practicasanalistas", data); // Asegúrate de que "practicasanalistas" sea la colección correcta
      alert("Práctica agregada con éxito" + (id ? ` con ID: ${id}` : ""));

      // Agregar también a Supabase
      const { data: supabaseData, error: supabaseError } = await supabase
        .from("practicasanalistas") // Asume que tienes una tabla llamada 'practicasanalistas' en Supabase
        .insert([data]);

      if (supabaseError) {
        throw supabaseError;
      }

      alert("Práctica guardada en Supabase");

      // Limpiar los campos del formulario después de agregar la práctica
      setTitle("");
      setCompany("");
      setLogo("");
      setDescripcion("");
      setLocation("");
      setSalary("");
      setUrl("");
      setIsOtherLogo(false);
      setUploadedLogoUrl("");

      window.location.href = window.location.href;
    } catch (err) {
      window.location.href = window.location.href;
    }
  };

  return (
    <main className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Agregar Práctica</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Campo de Título */}
        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">
            Título *
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Introduce el título de la práctica"
            disabled={loading || uploading}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </label>

        {/* Campo de Compañía */}
        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">
            Compañía *
          </span>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Introduce el nombre de la compañía"
            disabled={loading || uploading}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </label>

        {/* Selección de Logo */}
        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">Logo *</span>
          <select
            value={logo} // Esto mantendrá el valor seleccionado
            onChange={(e) => {
              const selectedValue = e.target.value;
              setLogo(selectedValue);
              setIsOtherLogo(selectedValue === "otros"); // Se actualiza correctamente el estado
            }}
            disabled={loading || uploading}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Selecciona un logo</option>
            <option value="otros">Otros</option>
            <option value="https://lkgncdyfimsdbtymiroe.supabase.co/storage/v1/object/public/empresas/logos/Rimac%20Seguros.png">
              Rimac
            </option>
            <option value="https://lkgncdyfimsdbtymiroe.supabase.co/storage/v1/object/public/empresas/logos/Makita.png">
              Makita
            </option>
            <option value="https://lkgncdyfimsdbtymiroe.supabase.co/storage/v1/object/public/empresas/logos/Ajinomoto.png">
              Ajinomoto
            </option>
            <option value="https://yt3.googleusercontent.com/YiYGf83GoGGvZNyOPkWaYbx72NZgrNOXJula93d0jnznWyosF72pO7Psvv1IIa7iKJHWa6wl3A=s900-c-k-c0x00ffffff-no-rj">
              BCP
            </option>
            <option value="https://lkgncdyfimsdbtymiroe.supabase.co/storage/v1/object/public/empresas/logos/Aceros%20chilca.jpg">
              Aceros Chilca
            </option>
            <option value="https://lkgncdyfimsdbtymiroe.supabase.co/storage/v1/object/public/empresas/logos/DHL.png">
              DHL
            </option>
            <option value="https://lkgncdyfimsdbtymiroe.supabase.co/storage/v1/object/public/empresas/logos/La%20Positiva.png">
              La Positiva
            </option>
            <option value="https://lkgncdyfimsdbtymiroe.supabase.co/storage/v1/object/public/empresas/logos/Culqi.png">
              Culqui
            </option>
            <option value="https://lkgncdyfimsdbtymiroe.supabase.co/storage/v1/object/public/empresas/logos/Agrobanco.png">
              AgroBanco
            </option>
            <option value="https://lkgncdyfimsdbtymiroe.supabase.co/storage/v1/object/public/empresas/logos/Claro.jpg">
              Claro
            </option>
            <option value="https://lkgncdyfimsdbtymiroe.supabase.co/storage/v1/object/public/empresas/logos/Chubb.png">
              Chubb
            </option>
            <option value="https://lkgncdyfimsdbtymiroe.supabase.co/storage/v1/object/public/empresas/logos/Nestle.png">
              Nestle
            </option>
            <option value="https://lkgncdyfimsdbtymiroe.supabase.co/storage/v1/object/public/empresas/logos/NTT.png">
              NNTDATA
            </option>

            {/* Agrega más opciones según sea necesario */}
          </select>
        </label>

        {isOtherLogo && ( // Condición para mostrar el campo de carga de archivo solo cuando "otros" esté seleccionado
          <label className="block">
            <span className="text-gray-700 font-semibold mb-1 block">
              Sube tu logo
            </span>

            {/* Input de archivo oculto */}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              id="file-upload" // Asociamos este input con el botón
              disabled={loading || uploading}
              className="hidden" // Ocultamos el input nativo
            />

            {/* Botón personalizado que reemplaza el input de archivo */}
            <label
              htmlFor="file-upload"
              className="w-full cursor-pointer bg-blue-600 text-white p-2 rounded-md text-center"
            >
              Seleccionar archivo
            </label>

            {uploading && (
              <p className="mt-2 text-sm text-blue-600 font-medium">
                Subiendo archivo...
              </p>
            )}
            {uploadedLogoUrl && ( // Mostrar el enlace solo después de que el logo haya sido subido
              <a
                href={uploadedLogoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-blue-700 underline"
              >
                Ver logo subido
              </a>
            )}
          </label>
        )}

        {/* Campo de Descripción */}
        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">
            Descripción *
          </span>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Escribe una breve descripción de la práctica"
            disabled={loading || uploading}
            required
            rows={4}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </label>

        {/* Campo de Ubicación */}
        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">
            Ubicación *
          </span>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Introduce la ubicación de la práctica"
            disabled={loading || uploading}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </label>

        {/* Campo de Salario */}
        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">
            Salario *
          </span>
          <input
            type="text"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="Introduce el salario de la práctica"
            disabled={loading || uploading}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </label>

        {/* Campo de URL */}
        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">URL *</span>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Introduce la URL de la oferta"
            disabled={loading || uploading}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </label>

        {/* Botón de Enviar */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
        >
          Guardar Práctica
        </button>

        {error && (
          <p className="text-red-600 font-semibold mt-3">Error: {error}</p>
        )}
      </form>
    </main>
  );
}
