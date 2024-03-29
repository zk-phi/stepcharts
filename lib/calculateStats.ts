function isJump(d: Arrow["direction"]): boolean {
  const nonZeroes = d.split("").reduce<number>((total, cardinal) => {
    if (cardinal !== "0") {
      return total + 1;
    }
    return total;
  }, 0);

  return nonZeroes === 2;
}

function isJack(d: Arrow, p: Arrow | undefined): boolean {
  if (!p) {
    return false;
  }

  if (isJump(d.direction)) {
    return false;
  }

  if (d.direction !== p.direction) {
    return false;
  }

  return d.offset - p.offset <= 1 / 8;
}

function calculateStats(chart: Stepchart): Stats {
  const jacks = chart.arrows.filter((a, i, array) => isJack(a, array[i - 1]));
  const shocks = chart.arrows.filter((a) => a.direction.match(/M/)).length;

  return {
    jacks: jacks.length,
    shocks,
  };
}

export { calculateStats };
