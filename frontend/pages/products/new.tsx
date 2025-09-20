import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ProductCreationWizard from '@/components/products/ProductCreationWizard';

// ################## ----- NEW PRODUCT PAGE COMPONENT ----- ##################
// Page for creating new products with full Printful integration
// Uses the ProductCreationWizard component for the complete flow
// ################################################################
const NewProduct: React.FC = () => {
  const [showAdvancedFlow, setShowAdvancedFlow] = useState(false);
  const router = useRouter();

  // Check if user wants the new Printful flow or simple flow
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const useAdvanced = urlParams.get('advanced') === 'true';
    setShowAdvancedFlow(useAdvanced || true); // Default to advanced flow
  }, []);

  // For now, always show the new wizard - we can add a toggle later
  return <ProductCreationWizard />;
};

export default NewProduct;
