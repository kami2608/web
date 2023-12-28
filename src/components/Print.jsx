import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import ReceiptPaper from "./ReceiptPaper";
import Buttonme from "./Buttonme/Buttonme";

class PrintComponent extends React.Component {
  render() {
    return (
      <div id="print">
        <ReceiptPaper form ={this.props.form} />
      </div>
    );
  }
}

function AppP({ onBack, form }) {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <PrintComponent ref={componentRef} form = {form}/>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <div
          style={{
            marginTop: "10px",
            marginBottom: "20px",
            marginRight: "400px",
          }}
        >
          <Buttonme content={"In giấy biên nhận"} onClick={handlePrint} />
        </div>
        <div style={{ marginTop: "10px", marginBottom: "20px" }}>
          <Buttonme content={"Trở về"} onClick={onBack} />
        </div>
      </div>
    </div>
  );
}

export default AppP;
