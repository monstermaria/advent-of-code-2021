import java.util.ArrayList;
import java.util.Date;

public class Day15ArrayList {
  static ArrayList<ArrayList<Integer>> riskLevelMap = new ArrayList<>();
  static ArrayList<ArrayList<Integer>> lowestRiskMap = new ArrayList<>();
  static int lowestRisk = Integer.MAX_VALUE;

  static void getRiskLevelMap(ArrayList<String> inputLines) {
    for (int row = 0; row < inputLines.size(); row++) {

      String riskRow = inputLines.get(row);

      if (riskRow.equals("")) {
        continue;
      }

      riskLevelMap.add(new ArrayList<>());
      lowestRiskMap.add(new ArrayList<>());

      for (int column = 0; column < riskRow.length(); column++) {

        riskLevelMap.get(row).add(Integer.parseInt(riskRow.substring(column, column + 1)));
        lowestRiskMap.get(row).add(Integer.MAX_VALUE);
      }
    }
  }

  static void calculateRouteRisk(int row, int column, int risk) {

    risk += riskLevelMap.get(row).get(column);

    if (risk >= lowestRiskMap.get(row).get(column)) {
      return;
    }

    if (risk >= lowestRisk) {
      return;
    }

    lowestRiskMap.get(row).set(column, risk);

    if (row == riskLevelMap.size() - 1 && column == riskLevelMap.get(row).size() - 1) {
      lowestRisk = risk;
      return;
    }

    if (row < riskLevelMap.size() - 1) {
      calculateRouteRisk(row + 1, column, risk);
    }

    if (column < riskLevelMap.get(row).size() - 1) {
      calculateRouteRisk(row, column + 1, risk);
    }

    if (column > 0) {
      calculateRouteRisk(row, column - 1, risk);
    }

    if (row > 0) {
      calculateRouteRisk(row - 1, column, risk);
    }
  }

  public static void main(String[] args) {
    ArrayList<String> inputLines = FileUtilities.readInputFromFile("./riskLevel.txt");

    getRiskLevelMap(inputLines);

    Date start = new Date();

    calculateRouteRisk(0, 0, -riskLevelMap.get(0).get(0));

    Date stop = new Date();

    long timeInMilliseconds = stop.getTime() - start.getTime();

    System.out.println("Time to calculate route risk: " + timeInMilliseconds / 1000);

    System.out.println("The lowest risk is " + lowestRisk);
  }
}
