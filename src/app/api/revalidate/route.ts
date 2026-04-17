import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidation-secret');
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { _type, slug } = body;

    switch (_type) {
      case 'product':
        if (slug?.current) {
          revalidatePath(`/motos`);
          revalidatePath(`/cuadraciclos`);
          revalidatePath(`/marino`);
        }
        revalidateTag('products', { expire: 0 });
        break;
      case 'dealership':
        revalidatePath('/sucursales');
        revalidateTag('dealerships', { expire: 0 });
        break;
      case 'category':
        revalidateTag('categories', { expire: 0 });
        revalidatePath('/motos');
        break;
      default:
        revalidateTag('all', { expire: 0 });
    }

    return NextResponse.json({ revalidated: true, type: _type });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
