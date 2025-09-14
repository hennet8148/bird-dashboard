<?php
$sites = [
  'https://www.speedlimit25.com'      => 'Speed Limit 25',
  'https://www.hardtimesguitar.com'   => 'Hard Times Guitar Company',
  'https://feedingcrows.tech'         => 'Feeding Crows Tech',
  'https://davidsonfarmbirdproject.org' => 'Davidson Farm Bird Project',
];
$current = $_SERVER['HTTP_HOST'] ?? '';
?>

</main>

<footer class="mt-10 mb-8">
  <div class="mx-auto max-w-6xl px-4 sm:px-6">
    <div class="flex justify-center">
      <div class="bg-neutral-900 text-white w-full sm:w-auto rounded-2xl sm:rounded-full px-5 py-4 sm:px-7 sm:py-3 shadow-sm ring-1 ring-white/10">
        <div class="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-4">
          <span class="text-[11px] tracking-wider uppercase text-white/60">Other projects</span>
          <nav class="text-sm">
            <ul class="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
              <?php
              $first = true;
              foreach ($sites as $url => $label) {
                if (strpos($current, parse_url($url, PHP_URL_HOST)) !== false) continue;
                if (!$first) echo '<li class="hidden sm:inline opacity-40">·</li>';
                $first = false;
                echo '<li><a class="underline-offset-4 hover:underline" href="' . $url . '">' . $label . '</a></li>';
              }
              ?>
            </ul>
          </nav>
          <span class="text-xs text-white/60">© 2025 Hard Times Guitar</span>
        </div>
      </div>
    </div>
  </div>
</footer>

</body>
</html>

