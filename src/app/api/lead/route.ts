import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const leadSchema = z.object({
  productId: z.string().optional(),
  productName: z.string().optional(),
  name: z.string().min(2, 'Nombre requerido'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().regex(/^[2467]\d{7}$/, 'Número de teléfono inválido'),
  email: z.union([z.string().email(), z.literal('')]).optional(),
  message: z.string().optional(),
  source: z.enum(['product_page', 'cotizador', 'cotizadormarino', 'contacto', 'taller']),
  serviceType: z.string().optional(),
  location: z.string().optional(),
  cedula: z.string().optional(),
  model: z.string().optional(),
  preferredBranch: z.string().optional(),
  financing: z.string().optional(),
  acceptTerms: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = leadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const lead = result.data;

    // Future: persist to database, send notification, etc.
    console.log('[LEAD]', JSON.stringify(lead, null, 2));

    return NextResponse.json({ success: true, message: 'Lead received' });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
