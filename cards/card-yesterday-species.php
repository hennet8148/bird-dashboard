<div class="bg-white p-4 rounded shadow text-center border border-gray-200">
  <p class="text-sm text-gray-500">Unique Species — Previous Day</p>
  <p id="statYesterday" class="text-2xl font-bold">Loading…</p>

  <!-- Toggle Button -->
  <button id="toggleSpeciesListYesterday"
          class="text-sm text-blue-600 hover:underline mt-2">
    Show List ▼
  </button>

  <!-- Hidden List (collapsed by default) -->
  <div id="speciesListContainerYesterday"
       class="transition-all duration-300 ease-in-out max-h-0 overflow-hidden opacity-0 mt-2 text-sm text-gray-700">
    <ul id="speciesListYesterday" class="list-disc list-inside space-y-1 px-4 text-left"></ul>
  </div>

  <!-- Confidence Slider -->
  <label for="confSliderYesterday" class="block text-sm font-medium mt-4 text-gray-700">
    Confidence Threshold
  </label>
  <input type="range" id="confSliderYesterday" min="0" max="1" step="0.01" value="0.50"
         class="w-full mt-1" />
  <span id="confValueYesterday" class="text-sm text-gray-600">0.50</span>
</div>

