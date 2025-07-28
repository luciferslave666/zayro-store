// File: src/emails/OrderConfirmationEmail.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Row,
  Column
} from "@react-email/components";
import * as React from "react";

interface OrderConfirmationEmailProps {
  referenceId: string;
  totalPrice: number;
  orderItems: { name: string; quantity: number; price: number; }[];
}

export const OrderConfirmationEmail = ({
  referenceId,
  totalPrice,
  orderItems,
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Konfirmasi Pesanan Anda dari Zayro Store</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Terima Kasih Atas Pesanan Anda!</Heading>
        <Text style={paragraph}>
          Hai, kami telah menerima pesanan Anda. Berikut adalah rinciannya:
        </Text>
        <Text style={paragraph}>
          <strong>Order ID:</strong> {referenceId}
        </Text>

        {orderItems.map((item) => (
          <Row key={item.name} style={itemRow}>
            <Column>
              {item.name} (x{item.quantity})
            </Column>
            <Column style={itemPrice}>
              Rp{(item.price * item.quantity).toLocaleString("id-ID")}
            </Column>
          </Row>
        ))}

        <Row style={totalRow}>
            <Column><strong>Total</strong></Column>
            <Column style={itemPrice}>
                <strong>Rp{totalPrice.toLocaleString("id-ID")}</strong>
            </Column>
        </Row>

        <Text style={paragraph}>
          Kami akan segera memproses pesanan Anda. Terima kasih telah berbelanja di Zayro Store!
        </Text>
      </Container>
    </Body>
  </Html>
);

export default OrderConfirmationEmail;

// --- STYLES ---
const main = { backgroundColor: "#f6f9fc", fontFamily: "Arial, sans-serif" };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "20px 0 48px", width: "580px" };
const heading = { fontSize: "28px", fontWeight: "bold", marginTop: "48px", textAlign: "center" as const };
const paragraph = { fontSize: "16px", lineHeight: "24px", textAlign: "left" as const, padding: "0 20px" };
const itemRow = { padding: "0 20px", borderBottom: "1px solid #cccccc" };
const totalRow = { padding: "10px 20px 0 20px", fontWeight: "bold" };
const itemPrice = { textAlign: "right" as const };