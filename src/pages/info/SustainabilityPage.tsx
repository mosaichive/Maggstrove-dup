import InfoPage from "@/components/layout/InfoPage";

const SustainabilityPage = () => (
  <InfoPage title="Sustainability">
    <p className="text-muted-foreground leading-relaxed">At Maggs Trove, we believe that fashion and responsibility go hand in hand. We're committed to reducing our environmental footprint through thoughtful sourcing, ethical manufacturing, and sustainable packaging.</p>
    <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Our Commitments</h2>
    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
      <li>Eco-friendly packaging made from recycled materials</li>
      <li>Partnering with ethical suppliers who uphold fair labour practices</li>
      <li>Reducing waste through made-to-order and limited-run collections</li>
      <li>Carbon-neutral shipping on all orders</li>
    </ul>
  </InfoPage>
);

export default SustainabilityPage;
