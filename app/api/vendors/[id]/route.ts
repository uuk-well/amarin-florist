import { MockVendorsRepository } from "@/lib/repositories/vendors-repository";
import type { VendorInput } from "@/lib/models/vendor";

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/vendors/[id]">
) {
  const { id } = await ctx.params;

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
    id,
    vendorName: body.vendorName,
    picName: body.picName,
  };

  const repo = new MockVendorsRepository();
  const vendor = await repo.update(id, input);
  if (!vendor) {
    return Response.json({ error: "Vendor tidak ditemukan" }, { status: 404 });
  }
  return Response.json({ vendor });
}
