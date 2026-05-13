const PreviewCustomizer = ({ designConfig, setDesignConfig }) => {
  const handleChange = (e) => {
    setDesignConfig({
      ...designConfig,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-slate-900 p-8 rounded-2xl">
      <h1 className="text-3xl text-white font-bold mb-8">
        Preview Customizer
      </h1>

      <div className="space-y-6">
        {/* Background Color */}
        <div>
          <label className="text-white block mb-2">
            Background Color
          </label>

          <input
            type="color"
            name="backgroundColor"
            value={designConfig.backgroundColor}
            onChange={handleChange}
            className="w-full h-14 rounded-lg"
          />
        </div>

        {/* Text Color */}
        <div>
          <label className="text-white block mb-2">
            Text Color
          </label>

          <input
            type="color"
            name="textColor"
            value={designConfig.textColor}
            onChange={handleChange}
            className="w-full h-14 rounded-lg"
          />
        </div>

        {/* Font Size */}
        <div>
          <label className="text-white block mb-2">
            Font Size
          </label>

          <input
            type="text"
            name="fontSize"
            placeholder="18px"
            value={designConfig.fontSize}
            onChange={handleChange}
            className="w-full p-4 rounded-lg"
          />
        </div>

        {/* Border Radius */}
        <div>
          <label className="text-white block mb-2">
            Border Radius
          </label>

          <input
            type="text"
            name="borderRadius"
            placeholder="20px"
            value={designConfig.borderRadius}
            onChange={handleChange}
            className="w-full p-4 rounded-lg"
          />
        </div>

        {/* Padding */}
        <div>
          <label className="text-white block mb-2">
            Padding
          </label>

          <input
            type="text"
            name="padding"
            placeholder="20px"
            value={designConfig.padding}
            onChange={handleChange}
            className="w-full p-4 rounded-lg"
          />
        </div>

        {/* Border */}
        <div>
          <label className="text-white block mb-2">
            Border
          </label>

          <input
            type="text"
            name="border"
            placeholder="2px solid red"
            value={designConfig.border}
            onChange={handleChange}
            className="w-full p-4 rounded-lg"
          />
        </div>

        {/* Box Shadow */}
        <div>
          <label className="text-white block mb-2">
            Box Shadow
          </label>

          <input
            type="text"
            name="boxShadow"
            placeholder="0px 5px 20px rgba(0,0,0,0.3)"
            value={designConfig.boxShadow}
            onChange={handleChange}
            className="w-full p-4 rounded-lg"
          />
        </div>

        {/* Button Color */}
        <div>
          <label className="text-white block mb-2">
            Button Color
          </label>

          <input
            type="color"
            name="buttonColor"
            value={designConfig.buttonColor}
            onChange={handleChange}
            className="w-full h-14 rounded-lg"
          />
        </div>

        {/* Button Text Color */}
        <div>
          <label className="text-white block mb-2">
            Button Text Color
          </label>

          <input
            type="color"
            name="buttonTextColor"
            value={designConfig.buttonTextColor}
            onChange={handleChange}
            className="w-full h-14 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewCustomizer;