import { MockVendorsRepository } from "@/lib/repositories/vendors-repository";
import type { VendorInput } from "@/lib/models/vendor";

export async function GET() {
  const repo = new MockVendorsRepository();
  const vendors = await repo.list();
  return Response.json({ vendors });
}

function generateVendorId(): string {
  return `V-${String(Date.now()).slice(-6)}`;
}

export async function POST(request: Request) {
  let body: Partial<VendorInput>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  if (!body.vendorName?.toString().trim() || !body.picName?.toString().trim()) {
    return Response.json(
      { error: "Nama vendor dan PIC wajib diisi." },
      { status: 400 }
    );
  }

  const input: VendorInput = {
    id: body.id?.toString().trim() || generateVendorId(),
    vendorName: body.vendorName,
    picName: body.picName,
  };

  const repo = new MockVendorsRepository();
  const vendor = await repo.create(input);
  return Response.json({ vendor }, { status: 201 });
}
