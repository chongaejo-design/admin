import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function Home() {
  const sigRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    ssn: "",
    income: "",
  });

  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const autoScreening = () => {
    const income = Number(form.income);

    const fakeCreditScore = 720;

    if (income >= 3000000 && fakeCreditScore >= 680) {
      return "승인";
    }

    return "거절";
  };

  const generatePDF = async (status) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText("Loan / Rental Screening Contract", {
      x: 50,
      y: 750,
      size: 24,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`이름: ${form.name}`, {
      x: 50,
      y: 680,
      size: 16,
      font,
    });

    page.drawText(`연락처: ${form.phone}`, {
      x: 50,
      y: 650,
      size: 16,
      font,
    });

    page.drawText(`심사결과: ${status}`, {
      x: 50,
      y: 620,
      size: 18,
      font,
      color: rgb(0, 0.5, 0),
    });

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "contract.pdf";
    a.click();
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.ssn) {
      alert("정보를 입력해주세요.");
      return;
    }

    if (sigRef.current.isEmpty()) {
      alert("전자서명을 입력해주세요.");
      return;
    }

    const status = autoScreening();

    setResult(status);

    await generatePDF(status);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: 20,
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          background: "#fff",
          padding: 30,
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 30,
          }}
        >
          대출 · 렌탈 자동심사 시스템
        </h1>

        <input
          name="name"
          placeholder="이름"
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="phone"
          placeholder="휴대폰번호"
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="ssn"
          placeholder="주민등록번호"
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="income"
          placeholder="월소득"
          onChange={handleChange}
          style={inputStyle}
        />

        <div style={{ marginTop: 30 }}>
          <h3>전자서명</h3>

          <div
            style={{
              border: "2px solid #ddd",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <SignatureCanvas
              penColor="black"
              canvasProps={{
                width: 600,
                height: 200,
                className: "sigCanvas",
              }}
              ref={sigRef}
            />
          </div>

          <button
            onClick={() => sigRef.current.clear()}
            style={clearButton}
          >
            서명 지우기
          </button>
        </div>

        <button
          onClick={handleSubmit}
          style={submitButton}
        >
          자동심사 진행
        </button>

        {result && (
          <div
            style={{
              marginTop: 30,
              padding: 20,
              borderRadius: 10,
              background:
                result === "승인"
                  ? "#e7f8ec"
                  : "#ffecec",
            }}
          >
            <h2>심사결과: {result}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 15,
  marginBottom: 15,
  borderRadius: 10,
  border: "1px solid #ccc",
  fontSize: 16,
};

const submitButton = {
  width: "100%",
  padding: 18,
  background: "#0038ff",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontSize: 18,
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: 30,
};

const clearButton = {
  marginTop: 10,
  padding: "10px 20px",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};