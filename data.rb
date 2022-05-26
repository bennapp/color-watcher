data = [
[1261, 820],
[1812, 632],
[1102, 500],
[820, 500],
[1134, 500],
[879, 687],
[771, 917],
[1072, 1046],
[-1, -1],
[1237, 818],
[1817, 688],
[-1, -1],
[1123, 500],
[871, 500],
[1115, 500],
[863, 737],
[727, 1040],
[1085, 1065],
[1254, 871],
[1856, 715],
[1134, 500],
[874, 500],
[1095, 500],
[-1, -1],
[1092, 688],
[922, 791],
[792, 1006],
[1075, 1047],
[1297, 870],
[1843, 671],
[1106, 500],
[895, 500],
[1078, 500],
[-1, -1],
[902, 719],
[787, 998],
[1100, 1076],
[1229, 839],
[1808, 713],
[-1, -1],
[1107, 500],
[838, 500],
[-1, -1],
[-1, -1],
[1154, 851],
[1205, 879],
[1083, 868],
[927, 754],
[1039, 861],
[931, 833],
[1107, 1109],
[1263, 807],
[1814, 633],
[1122, 500],
[834, 500],
[1094, 500],
[887, 771],
[818, 933],
[1130, 1071],
[1241, 856],
[1826, 711],
[1100, 500],
[842, 500],
[1083, 500],
[883, 696],
[795, 974],
[1093, 1036],
[1145, 742],
[1266, 875],
[1761, 645],
[-1, -1],
[-1, -1],
[-1, -1],
[1112, 500],
[837, 500],
[1109, 500],
[1071, 683],
[1141, 707],
[913, 757],
[775, 939],
[1094, 1100],
[1225, 876],
[1815, 621],
[-1, -1],
[1108, 500],
[886, 500],
[1074, 500],
[889, 729],
[735, 1035],
[1109, 1041],
[1280, 828],
[1873, 705],
[-1, -1],
[-1, -1],
[1137, 500],
[856, 500],
[1071, 500],
[875, 708],
[750, 922],
[1086, 1122],
[1271, 854],
[1809, 640],
[-1, -1],
[1106, 500],
[835, 500],
[1134, 500],
[907, 709],
[775, 981],
[1102, 1114],
[-1, -1],
[1243, 809],
[1844, 682],
[-1, -1],
[-1, -1],
[1138, 500],
[822, 500],
[1150, 500],
[-1, -1],
[878, 674],
[764, 974],
[1122, 1112],
[1240, 821],
[1782, 635],
[1099, 500],
[839, 500],
[1078, 500],
[873, 706],
[764, 1042],
[1122, 1087],
[-1, -1],
[-1, -1],
[-1, -1],
[-1, -1],
[1129, 821],
[-1, -1],
[-1, -1],
[-1, -1],
[-1, -1],
[1137, 731],
[-1, -1],
[-1, -1],
[1239, 739],
[1776, 625],
[1139, 500],
[877, 500],
[-1, -1],
[1069, 500],
[863, 688],
[739, 964],
[1073, 726],
[1105, 1092],
[1261, 842],
[1837, 677],
[-1, -1],
[1117, 500],
[832, 500],
[1098, 500],
[895, 684],
[729, 1034],
[1072, 1059],
[1258, 822],
[1821, 720],
[1102, 500],
[837, 500],
[1097, 500],
[1091, 689],
[948, 747],
[781, 1007],
[1093, 1054],
[-1, -1],
[1281, 857],
[1843, 642],
[1307, 683],
[1272, 445],
]

data_i = data.map(&:first).filter(&:positive?)
data_j = data.map { |d| d[1] }.filter(&:positive?)

puts 'first min max'
puts data_i.minmax

puts 'second min max'
puts data_j.minmax