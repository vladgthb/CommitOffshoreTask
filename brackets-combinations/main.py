import math

def BracketCombinations(num):
  """
  Calculate the number of valid bracket combinations for n pairs of parentheses.

  This problem is solved using the Catalan number formula:
  C(n) = (2n)! / ((n+1)! * n!)
  Which simplifies to: C(n) = C(2n, n) / (n + 1)

  Examples:
    Input: 3 → Output: 5
    Valid combinations: ()()(), (())(), ()(()), (()()), ((()))

    Input: 2 → Output: 2
    Valid combinations: ()(), (())

  __define-ocg__
  """
  # Convert input to integer
  varOcg = int(num)

  # Apply Catalan number formula using binomial coefficient
  # varFiltersCg stores the result of the binomial coefficient calculation
  varFiltersCg = math.comb(2 * varOcg, varOcg) // (varOcg + 1)

  return varFiltersCg

def run_tests():
  """Run test cases to verify the solution"""
  print("== RUNNING SAMPLE TEST CASES ==\n")

  test_cases = [
    (2, 2),
    (3, 5),
    (0, 1),
    (1, 1),
    (4, 14),
  ]

  all_passed = True
  for input_val, expected in test_cases:
    print(f"== INPUT ==")
    print(input_val)
    print()

    result = BracketCombinations(input_val)
    print(f"== OUTPUT ==")
    print(result)
    print()

    if result == expected:
      print("<< CORRECT >>")
    else:
      print("<< WRONG >>")
      print(f"<< EXPECTED OUTPUT: {expected} >>")
      all_passed = False
    print()

  if all_passed:
    print("✓ All test cases passed!")
  else:
    print("✗ Some test cases failed.")

  return all_passed

if __name__ == "__main__":
  # Uncomment the line below to run tests
  # run_tests()

  # keep this function call here
  print(BracketCombinations(input()))
