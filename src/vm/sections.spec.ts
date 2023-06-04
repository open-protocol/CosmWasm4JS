import { decodeSections } from "./sections";

test("decode sections works for multiple elements", () => {
  let dec = decodeSections(Buffer.from([0xaa, 0x00, 0x00, 0x00, 0x01]));
  expect(dec[0].toString("hex")).toBe("aa");
  dec = decodeSections(Buffer.from([0xaa, 0x00, 0x00, 0x00, 0x01, 0xde, 0xde, 0x00, 0x00, 0x00, 0x02]));
  expect(dec[0].toString("hex")).toBe("aa");
  expect(dec[1].toString("hex")).toBe("dede");
  dec = decodeSections(Buffer.from([0xaa, 0x00, 0x00, 0x00, 0x01, 0xde, 0xde, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00]));
  expect(dec[0].toString("hex")).toBe("aa");
  expect(dec[1].toString("hex")).toBe("dede");
  expect(dec[2].toString("hex")).toBe("");
  dec = decodeSections(Buffer.from("AA00000001DEDE0000000200000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000013", "hex"));
  expect(dec[0].toString("hex")).toBe("aa");
  expect(dec[1].toString("hex")).toBe("dede");
  expect(dec[2].toString("hex")).toBe("");
  expect(dec[3].toString("hex")).toBe("ffffffffffffffffffffffffffffffffffffff");
});
