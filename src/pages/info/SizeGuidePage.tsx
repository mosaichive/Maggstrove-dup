import InfoPage from "@/components/layout/InfoPage";

const SizeGuidePage = () => (
  <InfoPage title="Size Guide">
    <p className="text-muted-foreground leading-relaxed mb-6">Find your perfect fit with our size chart below. All measurements are in centimetres.</p>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border border-border">
        <thead className="bg-secondary text-foreground">
          <tr>
            <th className="px-4 py-3 border-b border-border">Size</th>
            <th className="px-4 py-3 border-b border-border">Bust</th>
            <th className="px-4 py-3 border-b border-border">Waist</th>
            <th className="px-4 py-3 border-b border-border">Hips</th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          <tr><td className="px-4 py-2 border-b border-border">XS</td><td className="px-4 py-2 border-b border-border">78–82</td><td className="px-4 py-2 border-b border-border">60–64</td><td className="px-4 py-2 border-b border-border">86–90</td></tr>
          <tr><td className="px-4 py-2 border-b border-border">S</td><td className="px-4 py-2 border-b border-border">82–86</td><td className="px-4 py-2 border-b border-border">64–68</td><td className="px-4 py-2 border-b border-border">90–94</td></tr>
          <tr><td className="px-4 py-2 border-b border-border">M</td><td className="px-4 py-2 border-b border-border">86–90</td><td className="px-4 py-2 border-b border-border">68–72</td><td className="px-4 py-2 border-b border-border">94–98</td></tr>
          <tr><td className="px-4 py-2 border-b border-border">L</td><td className="px-4 py-2 border-b border-border">90–96</td><td className="px-4 py-2 border-b border-border">72–78</td><td className="px-4 py-2 border-b border-border">98–104</td></tr>
          <tr><td className="px-4 py-2">XL</td><td className="px-4 py-2">96–102</td><td className="px-4 py-2">78–84</td><td className="px-4 py-2">104–110</td></tr>
        </tbody>
      </table>
    </div>
  </InfoPage>
);

export default SizeGuidePage;
